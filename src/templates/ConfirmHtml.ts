export const ConfirmHtml = (firstName: string, confirmationLink: string) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        a {
         color: white;
 
          }
          h1 {
            color: #4CAF50;
            font-size: 24px;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello, ${firstName}!</h1>
          <p>Thank you for registering with us. Please click the button below to confirm your email address and complete your registration:</p>
          <a href="${confirmationLink}" class="button">Confirm Email</a>
        </div>
      </body>
    </html>
  `;
};
