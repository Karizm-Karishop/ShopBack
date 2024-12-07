import { transporter } from '../../src/utilis/helper';

// Color palette for consistent branding
const COLOR_PALETTE = {
  APPROVED_PRIMARY: '#2E7D32',   // Deep green
  APPROVED_SECONDARY: '#4CAF50', // Bright green
  REJECTED_PRIMARY: '#C62828',   // Deep red
  REJECTED_SECONDARY: '#F44336', // Bright red
  NEUTRAL_DARK: '#333333',       // Dark gray for text
  NEUTRAL_LIGHT: '#F5F5F5',      // Light gray for backgrounds
  WHITE: '#FFFFFF'               // Pure white
};

/**
 * Generates a professional and responsive HTML email template for shop status updates
 * @param artistName Name of the artist
 * @param shopName Name of the shop
 * @param status Approval status of the shop
 * @param rejectionReason Optional reason for rejection
 * @returns Fully formatted HTML email template
 */
export const ShopStatusEmailTemplate = (
  artistName: string, 
  shopName: string, 
  status: 'approved' | 'rejected', 
  rejectionReason?: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop Status Update</title>
    <style>
        /* Reset and base styles */
        body, table, td, a { 
            -webkit-text-size-adjust: 100%; 
            -ms-text-size-adjust: 100%; 
        }
        table, td { 
            mso-table-lspace: 0pt; 
            mso-table-rspace: 0pt; 
        }
        img { 
            -ms-interpolation-mode: bicubic; 
            border: 0; 
            height: auto; 
            line-height: 100%; 
            outline: none; 
            text-decoration: none; 
        }

        /* Responsive layout */
        @media screen and (max-width: 600px) {
            .responsive-table {
                width: 100% !important;
            }
            .mobile-center {
                text-align: center !important;
            }
        }

        /* Custom email styles */
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: ${COLOR_PALETTE.NEUTRAL_LIGHT};
            line-height: 1.6;
            color: ${COLOR_PALETTE.NEUTRAL_DARK};
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${COLOR_PALETTE.WHITE};
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: ${status === 'approved' ? COLOR_PALETTE.APPROVED_PRIMARY : COLOR_PALETTE.REJECTED_PRIMARY};
            color: ${COLOR_PALETTE.WHITE};
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 30px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
            margin-top: 10px;
            background-color: ${status === 'approved' ? COLOR_PALETTE.APPROVED_SECONDARY : COLOR_PALETTE.REJECTED_SECONDARY};
            color: ${COLOR_PALETTE.WHITE};
        }
        .rejection-reason {
            background-color: ${COLOR_PALETTE.NEUTRAL_LIGHT};
            border-left: 4px solid ${COLOR_PALETTE.REJECTED_PRIMARY};
            padding: 15px;
            margin: 20px 0;
            font-style: italic;
        }
        .email-footer {
            background-color: ${COLOR_PALETTE.NEUTRAL_LIGHT};
            color: ${COLOR_PALETTE.NEUTRAL_DARK};
            text-align: center;
            padding: 15px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 15px;">
                <table class="responsive-table" width="600" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="email-container">
                            <div class="email-header">
                                <h1 style="margin: 0; color: ${COLOR_PALETTE.WHITE};">Shop Status Update</h1>
                            </div>
                            
                            <div class="email-body">
                                <p>Dear ${artistName},</p>

                                ${status === 'approved' ? `
                                <p>We are pleased to inform you that your shop <strong>${shopName}</strong> has been <span class="status-badge">${status}</span>.</p>
                                
                                <p>Congratulations! You can now start adding products and managing your shop on our platform.</p>
                                ` : `
                                <p>We regret to inform you that your shop <strong>${shopName}</strong> has been <span class="status-badge">${status}</span>.</p>

                                ${rejectionReason ? `
                                <div class="rejection-reason">
                                    <p><strong>Reason for Rejection:</strong> ${rejectionReason}</p>
                                </div>
                                ` : ''}
                                
                                <p>Please carefully review the details and make the necessary modifications.</p>
                                `}
                                
                                <p>If you have any questions or need further clarification, please don't hesitate to contact our support team.</p>
                                
                                <p>Best regards,<br>Your Platform Team</p>
                            </div>

                            <div class="email-footer">
                                © ${new Date().getFullYear()} Your Platform. All rights reserved.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

/**
 * Sends a shop status email to the specified artist
 * @param email Recipient's email address
 * @param artistName Name of the artist
 * @param shopName Name of the shop
 * @param status Approval status of the shop
 * @param rejectionReason Optional reason for rejection
 * @throws Will throw an error if email sending fails
 */
export const sendShopStatusEmail = async (
  email: string, 
  artistName: string, 
  shopName: string, 
  status: 'approved' | 'rejected', 
  rejectionReason?: string
) => {
  // Validate input parameters
  if (!email || !artistName || !shopName) {
    throw new Error('Missing required email parameters');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@yourplatform.com',
    to: email,
    subject: `Shop ${status.toUpperCase()}: ${shopName}`,
    html: ShopStatusEmailTemplate(artistName, shopName, status, rejectionReason)
  };

  try {
    // Send email and log success
    const info = await transporter.sendMail(mailOptions);
    console.log(`Shop status email sent to ${email}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    // Enhanced error logging
    console.error('Error sending shop status email:', error);
    throw new Error(`Failed to send shop status email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};