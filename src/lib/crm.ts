import { CRMIntegrationConfig, CRMSyncLog } from '../types';

/**
 * Sends a lead to all enabled CRM integrations and returns the execution logs.
 */
export async function sendLeadToCRM(
  lead: {
    type: 'Membership Request' | 'Contact Message';
    name: string;
    email: string;
    phone: string;
    details: Record<string, any>;
  },
  config: CRMIntegrationConfig
): Promise<CRMSyncLog[]> {
  const logs: CRMSyncLog[] = [];

  // 1. WEBHOOK CRM INTEGRATION
  if (config.webhookEnabled && config.webhookUrl) {
    const timestamp = new Date().toISOString();
    const logId = `log-wh-${Date.now()}`;
    const payload = {
      event: lead.type === 'Membership Request' ? 'membership_requested' : 'contact_inquiry',
      timestamp,
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone,
      ...lead.details
    };

    // Parse custom headers if any
    let customHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (config.webhookHeaders) {
      try {
        const parsed = JSON.parse(config.webhookHeaders);
        customHeaders = { ...customHeaders, ...parsed };
      } catch (e) {
        console.warn('Failed to parse custom webhook headers JSON, using defaults:', e);
      }
    }

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: customHeaders,
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      if (response.ok) {
        logs.push({
          id: logId,
          timestamp,
          leadType: lead.type,
          leadName: lead.name,
          leadEmail: lead.email,
          crmType: 'Webhook',
          status: 'Success',
          responseMessage: `Webhook trigger succeeded with status ${response.status} ${response.statusText}`,
          payloadSent: JSON.stringify(payload, null, 2)
        });
      } else {
        const responseText = await response.text().catch(() => '');
        logs.push({
          id: logId,
          timestamp,
          leadType: lead.type,
          leadName: lead.name,
          leadEmail: lead.email,
          crmType: 'Webhook',
          status: 'Failed',
          responseMessage: `Webhook trigger returned status ${response.status}: ${responseText || response.statusText}`,
          payloadSent: JSON.stringify(payload, null, 2)
        });
      }
    } catch (err: any) {
      console.error('Webhook sync failed:', err);
      // Frequently standard fetch on webhooks can trigger CORS warnings but still deliver payloads (e.g. some services don't send CORS headers back).
      // We will mark it as Failed with a clear hint.
      logs.push({
        id: logId,
        timestamp,
        leadType: lead.type,
        leadName: lead.name,
        leadEmail: lead.email,
        crmType: 'Webhook',
        status: 'Failed',
        responseMessage: `Network or CORS error: ${err.message || err}. (Check your webhook service's CORS policy or use a CORS-friendly URL)`,
        payloadSent: JSON.stringify(payload, null, 2)
      });
    }
  }

  // 2. HUBSPOT FORMS API INTEGRATION
  if (config.hubspotEnabled && config.hubspotPortalId && config.hubspotFormGuid) {
    const timestamp = new Date().toISOString();
    const logId = `log-hs-${Date.now()}`;
    
    // Split full name to firstname and lastname
    const nameParts = lead.name.trim().split(/\s+/);
    const firstname = nameParts[0] || '';
    const lastname = nameParts.slice(1).join(' ') || '';

    // Map lead details to HubSpot standard Form submission fields
    const fields = [
      { name: 'email', value: lead.email },
      { name: 'firstname', value: firstname },
      { name: 'lastname', value: lastname },
      { name: 'phone', value: lead.phone },
      { name: 'message', value: lead.details.message || lead.details.fitnessGoal || 'Interested in membership' }
    ];

    // Add extra custom fields for membership details if present
    if (lead.type === 'Membership Request') {
      if (lead.details.age) fields.push({ name: 'age', value: String(lead.details.age) });
      if (lead.details.gender) fields.push({ name: 'gender', value: lead.details.gender });
      if (lead.details.selectedPlanId) fields.push({ name: 'membership_plan', value: lead.details.selectedPlanId });
      if (lead.details.address) fields.push({ name: 'address', value: lead.details.address });
      if (lead.details.fitnessGoal) fields.push({ name: 'fitness_goal', value: lead.details.fitnessGoal });
    }

    const payload = {
      fields,
      context: {
        pageUri: window.location.href,
        pageName: document.title
      }
    };

    const hsUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${config.hubspotPortalId}/${config.hubspotFormGuid}`;

    try {
      const response = await fetch(hsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        logs.push({
          id: logId,
          timestamp,
          leadType: lead.type,
          leadName: lead.name,
          leadEmail: lead.email,
          crmType: 'HubSpot',
          status: 'Success',
          responseMessage: `HubSpot form submission succeeded! Message: ${responseData.inlineMessage || 'Successfully synced.'}`,
          payloadSent: JSON.stringify(payload, null, 2)
        });
      } else {
        logs.push({
          id: logId,
          timestamp,
          leadType: lead.type,
          leadName: lead.name,
          leadEmail: lead.email,
          crmType: 'HubSpot',
          status: 'Failed',
          responseMessage: `HubSpot error ${response.status}: ${responseData.message || 'Check Portal ID and Form GUID settings'}`,
          payloadSent: JSON.stringify(payload, null, 2)
        });
      }
    } catch (err: any) {
      console.error('HubSpot sync failed:', err);
      logs.push({
        id: logId,
        timestamp,
        leadType: lead.type,
        leadName: lead.name,
        leadEmail: lead.email,
        crmType: 'HubSpot',
        status: 'Failed',
        responseMessage: `HubSpot sync request failed: ${err.message || err}`,
        payloadSent: JSON.stringify(payload, null, 2)
      });
    }
  }

  // 3. MAILCHIMP CRM INTEGRATION
  if (config.mailchimpEnabled && config.mailchimpApiKey && config.mailchimpAudienceId) {
    const timestamp = new Date().toISOString();
    const logId = `log-mc-${Date.now()}`;
    
    const nameParts = lead.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      email_address: lead.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        PHONE: lead.phone,
        MESSAGE: lead.details.message || ''
      }
    };

    // Mailchimp standard REST API requires basic auth and does not support browser CORS.
    // However, we provide a clean mockup/attempt, and if a CORS error occurs (which is standard client-side),
    // we instruct the user on how they can bypass this or suggest using the Webhook URL (Zapier) for Mailchimp.
    const serverPrefix = config.mailchimpServer || config.mailchimpApiKey.split('-')[1] || 'us1';
    const mcUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${config.mailchimpAudienceId}/members`;

    try {
      const response = await fetch(mcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`anystring:${config.mailchimpApiKey}`)}`
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      if (response.ok) {
        logs.push({
          id: logId,
          timestamp,
          leadType: lead.type,
          leadName: lead.name,
          leadEmail: lead.email,
          crmType: 'Mailchimp',
          status: 'Success',
          responseMessage: `Mailchimp subscription added! Status: ${response.status}`,
          payloadSent: JSON.stringify(payload, null, 2)
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        logs.push({
          id: logId,
          timestamp,
          leadType: lead.type,
          leadName: lead.name,
          leadEmail: lead.email,
          crmType: 'Mailchimp',
          status: 'Failed',
          responseMessage: `Mailchimp API error ${response.status}: ${errData.detail || errData.title || 'Check credentials'}`,
          payloadSent: JSON.stringify(payload, null, 2)
        });
      }
    } catch (err: any) {
      console.warn('Mailchimp CORS or connection issue:', err);
      // Provide a helpful guide for Mailchimp client-side CORS limitations
      logs.push({
        id: logId,
        timestamp,
        leadType: lead.type,
        leadName: lead.name,
        leadEmail: lead.email,
        crmType: 'Mailchimp',
        status: 'Failed',
        responseMessage: `CORS policy blocked direct client-side Mailchimp API. Reason: Mailchimp APIs do not allow direct browser-to-server requests for security. Recommendation: Use our 'Webhook CRM' integration mapped to a Zapier/Make flow that updates Mailchimp securely.`,
        payloadSent: JSON.stringify(payload, null, 2)
      });
    }
  }

  return logs;
}
