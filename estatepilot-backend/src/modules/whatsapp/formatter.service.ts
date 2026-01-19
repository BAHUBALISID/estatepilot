export class WhatsAppFormatter {
  static formatProjectInfo(project: any): string {
    const lines = [
      `🏢 *${project.projectName}*`,
      '',
      `📍 *Location:*`,
      `${project.location.address}`,
      `${project.location.city}, ${project.location.state} - ${project.location.pincode}`,
      '',
      `💰 *Price Range:* ₹${project.priceRange.min.toLocaleString('en-IN')} - ₹${project.priceRange.max.toLocaleString('en-IN')}`,
      '',
      `📐 *Available Units:*`,
      ...project.unitConfigurations.map((unit: any) =>
        `• ${unit.type}: ${unit.carpetArea} sq.ft (₹${unit.priceRange.min.toLocaleString('en-IN')} - ₹${unit.priceRange.max.toLocaleString('en-IN')})`
      ),
      '',
      `🏊 *Key Amenities:*`,
      ...project.amenities.slice(0, 5).map((amenity: string) => `• ${amenity}`),
      project.amenities.length > 5 ? `• ...and ${project.amenities.length - 5} more` : '',
      '',
      `📋 *RERA:* ${project.reraNumber}`,
      `📅 *Possession:* ${project.possessionTimeline}`,
      '',
      `💬 *How can I help you with ${project.projectName}?*`
    ];
    
    return lines.filter(line => line !== '').join('\n');
  }
  
  static formatUnitDetails(unit: any, project: any): string {
    return `
*${unit.type} Details:*
        
📍 *Project:* ${project.projectName}
📏 *Carpet Area:* ${unit.carpetArea} sq.ft
📐 *Super Area:* ${unit.superArea} sq.ft
💰 *Price:* ₹${unit.priceRange.min.toLocaleString('en-IN')} - ₹${unit.priceRange.max.toLocaleString('en-IN')}
        
*Key Specifications:*
${project.specifications.slice(0, 3).map((spec: string) => `• ${spec}`).join('\n')}
        
Would you like to know about payment plans or loan options for this unit?
    `.trim();
  }
  
  static formatPaymentPlan(plan: any): string {
    return `
*${plan.name} Payment Plan*
        
${plan.description}
        
*Breakdown:*
• ${plan.percentageOnBooking}% on booking
• ${plan.constructionLinkedPercentage}% construction linked
• ${plan.possessionLinkedPercentage}% on possession
        
This plan is designed to make your investment comfortable and manageable.
    `.trim();
  }
  
  static formatLoanOption(loan: any): string {
    return `
*${loan.bankName} Home Loan*
        
🏦 *Bank:* ${loan.bankName}
📈 *Interest Rate:* ${loan.interestRate}%
💰 *Max Loan:* ${loan.maxLoanPercentage}% of property value
⏳ *Tenure Options:* ${loan.tenureOptions.join(', ')} months
        
Our team can help you with the loan application process.
    `.trim();
  }
  
  static createQuickReplies(options: string[]): any {
    return {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Please select an option:"
        },
        action: {
          buttons: options.map((option, index) => ({
            type: "reply",
            reply: {
              id: `option_${index + 1}`,
              title: option
            }
          }))
        }
      }
    };
  }
  
  static createListMessage(title: string, items: Array<{id: string, title: string, description?: string}>): any {
    return {
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: title
        },
        body: {
          text: "Please select an option from the list:"
        },
        action: {
          button: "View Options",
          sections: [{
            title: "Available Options",
            rows: items
          }]
        }
      }
    };
  }
}
