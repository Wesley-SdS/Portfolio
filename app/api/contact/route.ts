import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Verificar se a API key está configurada
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY não está configurada');
      return NextResponse.json(
        { success: false, message: 'Configuração de email não encontrada' },
        { status: 500 }
      );
    }

    // Email para você (destinatário)
    const recipientEmail = process.env.CONTACT_EMAIL || 'wesleysantos.0095@gmail.com';
    
    // Email de origem (deve ser um domínio verificado no Resend)
    // Para testes, você pode usar o domínio padrão do Resend: onboarding@resend.dev
    // Depois de verificar seu domínio, use: contact@seudominio.com
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Template HTML do email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-top: 20px;
            }
            .header {
              color: white;
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .info-box {
              background: #f8f9fa;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .info-label {
              font-weight: 600;
              color: #667eea;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            .info-value {
              color: #333;
              font-size: 16px;
            }
            .message-box {
              background: #fff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 20px;
              margin-top: 20px;
            }
            .message-label {
              font-weight: 600;
              color: #667eea;
              margin-bottom: 10px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .message-content {
              color: #555;
              white-space: pre-wrap;
              line-height: 1.8;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #888;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Nova Mensagem do Portfólio</h1>
            </div>
            <div class="content">
              <div class="info-box">
                <div class="info-label">Nome</div>
                <div class="info-value">${validatedData.name}</div>
              </div>
              
              <div class="info-box">
                <div class="info-label">Email</div>
                <div class="info-value">
                  <a href="mailto:${validatedData.email}" style="color: #667eea; text-decoration: none;">
                    ${validatedData.email}
                  </a>
                </div>
              </div>
              
              <div class="info-box">
                <div class="info-label">Assunto</div>
                <div class="info-value">${validatedData.subject}</div>
              </div>
              
              <div class="message-box">
                <div class="message-label">Mensagem</div>
                <div class="message-content">${validatedData.message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="footer">
                <p>Esta mensagem foi enviada através do formulário de contato do seu portfólio.</p>
                <p>Responda diretamente para: <a href="mailto:${validatedData.email}" style="color: #667eea;">${validatedData.email}</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: validatedData.email,
      subject: `Portfólio: ${validatedData.subject}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Erro ao enviar email via Resend:', error);
      return NextResponse.json(
        { success: false, message: 'Erro ao enviar mensagem. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    console.log('Email enviado com sucesso:', data);

    return NextResponse.json(
      { success: true, message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}



