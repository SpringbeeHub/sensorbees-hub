const crypto = require('crypto');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const FEISHU_WEBHOOK = process.env.FEISHU_WEBHOOK_URL;
    const FEISHU_SECRET = process.env.FEISHU_WEBHOOK_SECRET || '';

    if (!FEISHU_WEBHOOK) {
        return { statusCode: 500, body: 'Webhook not configured' };
    }

    try {
        const data = JSON.parse(event.body);

        const name = data.name || 'N/A';
        const email = data.email || 'N/A';
        const company = data.company || 'N/A';
        const subject = data.subject || 'N/A';
        const message = data.message || 'N/A';

        const feishuBody = {
            msg_type: 'interactive',
            card: {
                header: {
                    title: {
                        tag: 'plain_text',
                        content: '📩 新的客户咨询'
                    },
                    template: 'gold'
                },
                elements: [
                    {
                        tag: 'div',
                        text: {
                            tag: 'lark_md',
                            content: `**姓名：** ${name}\n**邮箱：** ${email}\n**公司：** ${company}\n**主题：** ${subject}\n**留言：**\n${message}`
                        }
                    }
                ]
            }
        };

        if (FEISHU_SECRET) {
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const stringToSign = `${timestamp}\n${FEISHU_SECRET}`;
            const hmac = crypto.createHmac('sha256', stringToSign);
            hmac.update('');
            const sign = hmac.digest('base64');
            feishuBody.timestamp = timestamp;
            feishuBody.sign = sign;
        }

        const response = await fetch(FEISHU_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feishuBody)
        });

        const result = await response.json();

        if (result.code !== 0) {
            return { statusCode: 502, body: JSON.stringify(result) };
        }

        return { statusCode: 200, body: 'OK' };
    } catch (err) {
        console.error('Error:', err);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
