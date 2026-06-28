/**
 * Helper utility to build pre-filled WhatsApp lead messages and open them.
 */

export interface WhatsAppLeadData {
  source: 'Membership' | 'Contact' | 'Chatbot' | 'Gym Visit' | 'Join Now';
  name: string;
  phone: string;
  email?: string;
  preferredPlan?: string;
  fitnessGoal?: string;
  message?: string;
}

export const getWhatsAppUrl = (data: WhatsAppLeadData): string => {
  const whatsappNumber = '918587882431';
  const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const messageLines = [
    '*New Website Lead*',
    '',
    `*Source:* ${data.source}`,
    `*Name:* ${data.name || 'N/A'}`,
    `*Phone:* ${data.phone || 'N/A'}`,
    `*Email:* ${data.email || 'N/A'}`,
    `*Preferred Plan:* ${data.preferredPlan || 'N/A'}`,
    `*Fitness Goal:* ${data.fitnessGoal || 'N/A'}`,
    `*Message:* ${data.message || 'N/A'}`,
    `*Date & Time:* ${currentDate}`
  ];

  const fullMessage = messageLines.join('\n');
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
};

/**
 * Opens the WhatsApp lead submission and returns the URL.
 */
export const triggerWhatsAppLead = (data: WhatsAppLeadData): string => {
  const url = getWhatsAppUrl(data);
  window.open(url, '_blank');
  return url;
};

/**
 * Direct CTA Quick messages
 */
export const openWhatsAppCTA = (type: 'Join Now' | 'Book Visit' | 'Contact Us' | 'Chatbot'): void => {
  const whatsappNumber = '918587882431';
  let message = '';

  switch (type) {
    case 'Join Now':
      message = 'Hi ManavDesignLab! I am ready to join ManavDesignLab and begin my premium coaching journey. Please guide me with the enrollment.';
      break;
    case 'Book Visit':
      message = 'Hi ManavDesignLab! I would love to book a free walkthrough tour and trial gym visit at your club. Please let me know the available timings.';
      break;
    case 'Contact Us':
      message = 'Hi ManavDesignLab! I am interested in your facilities and would like to talk with a club manager. Please get back to me.';
      break;
    case 'Chatbot':
      message = 'Hi ManavDesignLab! I am chatting with your MDL Assistant and would like to speak directly with an elite trainer.';
      break;
  }

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
