export enum Intent {
  GREETING = 'GREETING',
  PROJECT_INFO = 'PROJECT_INFO',
  PRICE = 'PRICE',
  LOCATION = 'LOCATION',
  AMENITIES = 'AMENITIES',
  RERA = 'RERA',
  POSSESSION = 'POSSESSION',
  PAYMENT_PLAN = 'PAYMENT_PLAN',
  LOAN = 'LOAN',
  SITE_VISIT = 'SITE_VISIT',
  CONTACT = 'CONTACT',
  ESCALATE = 'ESCALATE',
  UNKNOWN = 'UNKNOWN'
}

export const INTENT_KEYWORDS = {
  [Intent.GREETING]: ['hello', 'hi', 'hey', 'नमस्ते', 'हैलो', 'hi there'],
  [Intent.PRICE]: ['price', 'cost', 'rate', 'मूल्य', 'कीमत', 'दाम', 'budget', 'पैसा'],
  [Intent.LOCATION]: ['location', 'address', 'where', 'जगह', 'स्थान', 'address', 'map'],
  [Intent.AMENITIES]: ['amenities', 'facilities', 'features', 'सुविधाएं', 'फीचर्स', 'gym', 'pool', 'park'],
  [Intent.RERA]: ['rera', 'registration', 'legal', 'कानूनी', 'अनुमति', 'approval'],
  [Intent.POSSESSION]: ['possession', 'delivery', 'ready', 'मिलेगा', 'कब तक', 'हैंडओवर'],
  [Intent.PAYMENT_PLAN]: ['payment', 'installment', 'plan', 'भुगतान', 'किस्त', 'ईएमआई'],
  [Intent.LOAN]: ['loan', 'finance', 'bank', 'ऋण', 'बैंक', 'home loan'],
  [Intent.SITE_VISIT]: ['visit', 'site', 'see', 'देखना', 'मिलना', 'विज़िट']
};
