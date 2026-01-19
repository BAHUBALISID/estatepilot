import { IProject } from '../projects/projects.model';
import { Language } from '../../constants/languages';

export class GroundingService {
  static groundProjectData(project: IProject, language: Language = Language.ENGLISH): string {
    const projectData = project.toObject ? project.toObject() : project;
    
    let groundingText = `
PROJECT INFORMATION FOR REFERENCE (USE ONLY THIS DATA):

Project Name: ${projectData.projectName}

Location:
- Address: ${projectData.location.address}
- City: ${projectData.location.city}
- State: ${projectData.location.state}
- Pincode: ${projectData.location.pincode}
${projectData.location.googleMapsLink ? `- Google Maps: ${projectData.location.googleMapsLink}` : ''}

Price Range: ₹${projectData.priceRange.min.toLocaleString('en-IN')} - ₹${projectData.priceRange.max.toLocaleString('en-IN')}

Unit Configurations Available:
${projectData.unitConfigurations.map(unit => 
  `- ${unit.type}: Carpet Area ${unit.carpetArea} sq.ft, Super Area ${unit.superArea} sq.ft, Price ₹${unit.priceRange.min.toLocaleString('en-IN')} - ₹${unit.priceRange.max.toLocaleString('en-IN')}`
).join('\n')}

Amenities:
${projectData.amenities.map(amenity => `- ${amenity}`).join('\n')}

Key Specifications:
${projectData.specifications.map(spec => `- ${spec}`).join('\n')}

RERA Registration Number: ${projectData.reraNumber}

Possession Timeline: ${projectData.possessionTimeline}

Payment Plans:
${projectData.paymentPlans.map(plan => 
  `- ${plan.name}: ${plan.description}. ${plan.percentageOnBooking}% on booking, ${plan.constructionLinkedPercentage}% construction linked, ${plan.possessionLinkedPercentage}% on possession`
).join('\n')}

Loan Options:
${projectData.loanOptions.map(loan => 
  `- ${loan.bankName}: ${loan.interestRate}% interest rate, up to ${loan.maxLoanPercentage}% loan, tenure options: ${loan.tenureOptions.join(', ')} months`
).join('\n')}

Frequently Asked Questions:
${projectData.faqPoints.map(faq => 
  `Q: ${faq.question}\nA: ${faq.answer}`
).join('\n\n')}

Objection Handling Points:
${projectData.objectionHandlingPoints.map(obj => 
  `Objection: ${obj.objection}\nResponse: ${obj.response}`
).join('\n\n')}
`.trim();
    
    // Add language-specific instructions
    const languageInstruction = this.getLanguageInstruction(language);
    groundingText += `\n\n${languageInstruction}`;
    
    return groundingText;
  }
  
  private static getLanguageInstruction(language: Language): string {
    switch (language) {
      case Language.HINDI:
        return 'IMPORTANT: Respond in Hindi only. Use formal Hindi language. Do not mix English.';
      case Language.HINGLISH:
        return 'IMPORTANT: Respond in Hinglish (Hindi-English mix). Use simple words that are commonly understood.';
      default:
        return 'IMPORTANT: Respond in English only. Use professional, concise language.';
    }
  }
  
  static getConstraints(): string[] {
    return [
      'DO NOT invent or hallucinate any information not present in the provided project data.',
      'DO NOT provide prices, amenities, or specifications that are not explicitly listed.',
      'DO NOT make promises about possession dates, offers, or discounts unless specified.',
      'DO NOT use emojis, exaggerated language, or marketing fluff.',
      'If asked about something not covered in the project data, say: "I\'ll connect you with our team for more information."',
      'Keep responses concise and factual.',
      'If user asks for contact info, say: "I\'ll connect you with our sales team who can provide personalized assistance."',
      'If user wants to negotiate price, say: "Our prices are as per the mentioned ranges. I can connect you with our team for detailed discussion."',
      'ALWAYS maintain professional and helpful tone.'
    ];
  }
  
  static formatResponseForWhatsApp(text: string): string {
    // Clean up the response for WhatsApp
    return text
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .replace(/\.\s*\.\s*\./g, '...') // Fix ellipsis
      .trim();
  }
}
