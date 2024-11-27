export const TwoFactorAuthHtml = (firstName: string, sixDigitOTP: string) => {
    return `
  <!DOCTYPE html>
  <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>Two-Factor Authentication</title>
    <style>
      .otp-code {
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 10px;
        background-color: #f4f4f4;
        padding: 15px;
        border-radius: 8px;
        display: inline-block;
        color: #333;
      }
      .verify-button {
        background-color: #4A90E2;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        display: inline-block;
        font-weight: bold;
      }
      .lock-icon {
        width: 64px;
        height: 64px;
        margin: 20px 0;
      }
    </style>
  </head>
  <body class="body">
    <div dir="ltr" class="es-wrapper-color">
      <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper">
        <tbody>
          <tr>
            <td valign="top" class="esd-email-paddings">
              <table cellpadding="0" cellspacing="0" align="center" class="es-content">
                <tbody>
                  <tr>
                    <td align="center" class="esd-stripe">
                      <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" width="600" class="es-content-body">
                        <tbody>
                          <tr>
                            <td align="left" class="esd-structure es-p20t es-p20r es-p20l">
                              <table cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td width="560" align="center" valign="top" class="esd-container-frame">
                                      <table cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td align="center" class="esd-block-image" style="font-size:0px">
                                              <img src="https://as2.ftcdn.net/v2/jpg/05/54/25/77/1000_F_554257748_Zs4pRgnQras9BiQbjpbFncMHFB9oFZZ8.jpg" alt="Two-Factor Authentication" width="64" class="lock-icon">
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" class="esd-block-text es-p15t es-p15b">
                                              <h1>Two-Factor Authentication</h1>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" class="esd-block-text es-p10t es-p10b">
                                              <p style="font-size:16px">
                                                Hi ${firstName}, here's your 6-digit verification code:
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" class="esd-block-text es-p15t es-p15b">
                                              <div class="otp-code">
                                                ${sixDigitOTP}
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" class="esd-block-text es-p10t es-p10b">
                                              <p style="font-size:14px; color:#666;">
                                                This code will expire in 10 minutes. Do not share this code with anyone.
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" class="esd-block-text es-p20t es-p10b">
                                              <p style="line-height:150%">
                                                If you did not request this code, please contact our support team immediately.
                                              </p>
                                              <p style="line-height:150%">
                                                Need help? Email us at <a href="mailto:support@example.com">support@example.com</a>
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table cellpadding="0" cellspacing="0" align="center" class="es-footer">
                <tbody>
                  <tr>
                    <td align="center" class="esd-stripe">
                      <table align="center" cellpadding="0" cellspacing="0" width="640" class="es-footer-body" style="background-color:transparent">
                        <tbody>
                          <tr>
                            <td align="center" class="esd-block-text es-p20t es-p20b">
                              <p>© 2024 Your Company. All Rights Reserved.</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
  </html>
    `;
  };