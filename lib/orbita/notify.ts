import { Resend } from "resend";
import { notifyConfig } from "./config";

/**
 * E-mails to Wesley (never to the visitor — Google sends the invite). Reuses the
 * Resend sender of app/api/contact. All user content is HTML-escaped.
 */

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export interface LeadMail {
  kind: "booked" | "pending" | "request" | "callback";
  name: string;
  email: string;
  when?: string;
  meetLink?: string | null;
  summary?: string;
  locale: string;
}

const SUBJECT: Record<LeadMail["kind"], string> = {
  booked: "Órbita: conversa marcada",
  pending: "Órbita: pedido de conversa aguardando aprovação",
  request: "Órbita: pedido de conversa (agenda não conectada)",
  callback: "Órbita: visitante pediu retorno por e-mail",
};

/** Returns false when Resend is not configured (caller decides whether that is fatal). */
export async function sendLeadMail(mail: LeadMail): Promise<boolean> {
  const cfg = notifyConfig();
  if (!cfg.resendKey) return false;
  const rows: Array<[string, string]> = [
    ["Nome", mail.name],
    ["E-mail", mail.email],
    ["Idioma", mail.locale],
  ];
  if (mail.when) rows.push(["Quando", mail.when]);
  if (mail.meetLink) rows.push(["Meet", mail.meetLink]);
  const table = rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6B665C">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`)
    .join("");
  const action =
    mail.kind === "pending"
      ? "<p><strong>Modo aprovação:</strong> um bloqueio provisório foi criado na agenda. Confirme adicionando o visitante como convidado (com Meet) ou apague o bloqueio.</p>"
      : mail.kind === "request"
        ? "<p><strong>Agenda não conectada:</strong> nenhum evento foi criado. Responda ao visitante confirmando o horário e enviando o link do Meet.</p>"
        : mail.kind === "callback"
        ? "<p>Nenhum horário serviu (ou a agenda estava indisponível). Responda por e-mail com opções.</p>"
        : "<p>O convite com o link do Google Meet foi enviado ao visitante.</p>";
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#16150F;max-width:600px">
<h2 style="font-size:18px">${escapeHtml(SUBJECT[mail.kind])}</h2>${action}
<table style="font-size:14px;border-collapse:collapse">${table}</table>
${mail.summary ? `<h3 style="font-size:14px;margin-top:20px">Resumo da conversa (fornecido pelo visitante)</h3><p style="white-space:pre-wrap;font-size:14px">${escapeHtml(mail.summary)}</p>` : ""}
<p style="font-size:12px;color:#6B665C;margin-top:24px">Enviado pela Órbita (modo visitante). A transcrição não é armazenada no servidor.</p>
</body></html>`;
  const resend = new Resend(cfg.resendKey);
  const { error } = await resend.emails.send({
    from: cfg.from,
    to: cfg.to,
    replyTo: mail.email,
    subject: `${SUBJECT[mail.kind]} · ${mail.name}`,
    html,
  });
  if (error) throw new Error(`Resend failed: ${error.message}`);
  return true;
}
