// Legal content database
// In production, this would be stored in Supabase

export interface LegalArticle {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  content: string;
  steps: string[];
  helplines: { name: string; number: string }[];
  relatedLaws: string[];
}

export const legalCategories = [
  { id: 'workplace', name: 'Workplace Harassment', icon: 'Briefcase' },
  { id: 'domestic', name: 'Domestic Violence', icon: 'Home' },
  { id: 'cyber', name: 'Cyber Harassment', icon: 'Smartphone' },
  { id: 'stalking', name: 'Stalking & Abuse', icon: 'Eye' },
  { id: 'physical', name: 'Physical Assault', icon: 'ShieldAlert' },
];

export const legalArticles: LegalArticle[] = [
  {
    id: 'workplace-posh',
    title: 'Sexual Harassment at Workplace (POSH Act)',
    category: 'workplace',
    icon: 'Briefcase',
    description: 'Know your rights under the Prevention of Sexual Harassment (POSH) Act, 2013',
    content: `The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 is a legislative act in India that seeks to protect women from sexual harassment at their place of work.

**What Constitutes Sexual Harassment:**
- Unwelcome physical contact or advances
- Demand or request for sexual favors
- Making sexually colored remarks
- Showing pornography
- Any other unwelcome physical, verbal, or non-verbal conduct of sexual nature

**Your Rights:**
- Right to file a complaint with Internal Complaints Committee (ICC)
- Protection from retaliation
- Confidentiality of proceedings
- Right to interim relief during inquiry
- Right to compensation if found true

**Legal Provisions:**
Every workplace with 10+ employees must have an ICC. The complaint must be filed within 3 months of the incident (extendable to 6 months with valid reasons).`,
    steps: [
      'Document the incident with date, time, location, and witnesses',
      'File a written complaint with your organization\'s ICC within 3 months',
      'ICC will conduct an inquiry within 90 days',
      'If ICC is not constituted or unresponsive, approach Local Complaints Committee',
      'You can also file an FIR under IPC sections 354A, 509',
      'Seek legal counsel if needed',
    ],
    helplines: [
      { name: 'Women Helpline', number: '181' },
      { name: 'National Commission for Women', number: '7827-170-170' },
      { name: 'Police', number: '100' },
    ],
    relatedLaws: [
      'POSH Act, 2013',
      'IPC Section 354A (Sexual Harassment)',
      'IPC Section 509 (Insult to Modesty)',
    ],
  },
  {
    id: 'domestic-violence',
    title: 'Protection from Domestic Violence',
    category: 'domestic',
    icon: 'Home',
    description: 'Legal protection under the Domestic Violence Act, 2005',
    content: `The Protection of Women from Domestic Violence Act, 2005 provides protection to women from domestic violence and abuse.

**What is Domestic Violence:**
- Physical abuse
- Sexual abuse
- Verbal and emotional abuse
- Economic abuse (denying money, property rights)

**Who Can File:**
Any woman who is or has been in a domestic relationship - wife, live-in partner, sister, mother, or any female relative.

**Your Rights:**
- Right to residence (cannot be evicted from shared household)
- Right to maintenance
- Right to protection order
- Right to custody of children
- Right to compensation`,
    steps: [
      'Approach Protection Officer or file complaint with Magistrate',
      'File domestic incident report',
      'Magistrate can pass protection order, residence order, monetary relief',
      'File FIR under IPC sections 498A (cruelty), 323 (assault), 506 (criminal intimidation)',
      'Seek shelter homes if needed',
      'Get legal aid from Legal Services Authority',
    ],
    helplines: [
      { name: 'Women Helpline', number: '181' },
      { name: 'Domestic Violence Helpline', number: '1091' },
      { name: 'Police', number: '100' },
    ],
    relatedLaws: [
      'Domestic Violence Act, 2005',
      'IPC Section 498A (Cruelty)',
      'IPC Section 323 (Assault)',
      'IPC Section 506 (Criminal Intimidation)',
    ],
  },
  {
    id: 'cyber-harassment',
    title: 'Cyber Harassment & Online Abuse',
    category: 'cyber',
    icon: 'Smartphone',
    description: 'Protection against online harassment, cyberbullying, and digital threats',
    content: `Cyber harassment includes any form of harassment, stalking, or abuse conducted through digital means.

**What Constitutes Cyber Harassment:**
- Morphing photos
- Sharing private images without consent
- Online stalking
- Hate messages
- Impersonation
- Cyberbullying

**Your Rights:**
- Right to report to cybercrime cell
- Right to get content removed
- Right to file FIR
- Right to claim compensation`,
    steps: [
      'Take screenshots of all messages, posts, comments as evidence',
      'Block the harasser immediately',
      'Report the profile/content to the platform',
      'File complaint at www.cybercrime.gov.in',
      'File FIR at nearest police station or cybercrime cell',
      'For image-based abuse, approach National Cyber Crime Reporting Portal',
    ],
    helplines: [
      { name: 'Cyber Crime Helpline', number: '155260' },
      { name: 'Women Helpline', number: '181' },
      { name: 'National Cyber Crime Portal', number: '1930' },
    ],
    relatedLaws: [
      'IT Act Section 66E (Violation of Privacy)',
      'IT Act Section 67 (Publishing Obscene Material)',
      'IPC Section 354C (Voyeurism)',
      'IPC Section 509 (Insult to Modesty)',
    ],
  },
  {
    id: 'stalking',
    title: 'Stalking & Physical Harassment',
    category: 'stalking',
    icon: 'Eye',
    description: 'Legal recourse against stalking and unwanted following',
    content: `Stalking is a serious offense that includes following, monitoring, or contacting a woman against her will.

**What is Stalking:**
- Following you or contacting you despite clear indication of disinterest
- Monitoring your use of internet/electronic communication
- Watching or spying on you

**Your Rights:**
- Right to file complaint
- Right to restraining order
- Right to police protection`,
    steps: [
      'Document all incidents with dates, times, locations',
      'Inform the stalker clearly that their behavior is unwanted (via message if safer)',
      'File complaint at police station under IPC Section 354D',
      'Apply for restraining order from court',
      'Inform your workplace/college about the stalker',
      'Keep someone informed about your movements',
    ],
    helplines: [
      { name: 'Women Helpline', number: '181' },
      { name: 'Police', number: '100' },
      { name: 'Women Safety Wing', number: '1091' },
    ],
    relatedLaws: [
      'IPC Section 354D (Stalking)',
      'IPC Section 506 (Criminal Intimidation)',
      'IPC Section 509 (Insult to Modesty)',
    ],
  },
  {
    id: 'physical-assault',
    title: 'Physical Assault & Battery',
    category: 'physical',
    icon: 'ShieldAlert',
    description: 'Legal protection against physical violence and assault',
    content: `Physical assault against women is a serious criminal offense with strict legal consequences.

**What Constitutes Assault:**
- Any unwanted physical contact
- Physical violence
- Attempt to cause physical harm
- Use of force against person

**Your Rights:**
- Right to medical examination
- Right to file FIR
- Right to protection
- Right to compensation`,
    steps: [
      'Ensure your immediate safety - go to safe location',
      'Seek medical attention immediately and get medical report (MLC)',
      'File FIR at police station - you can file at any police station',
      'Get copy of FIR',
      'Medical evidence is crucial - preserve clothes, get photos of injuries',
      'Seek legal aid',
      'Apply for compensation under victim compensation scheme',
    ],
    helplines: [
      { name: 'Emergency', number: '112' },
      { name: 'Women Helpline', number: '181' },
      { name: 'Police', number: '100' },
    ],
    relatedLaws: [
      'IPC Section 323 (Assault)',
      'IPC Section 324 (Assault with Weapon)',
      'IPC Section 325 (Grievous Hurt)',
      'IPC Section 354 (Assault to Outrage Modesty)',
    ],
  },
];

export function getLegalArticlesByCategory(category: string): LegalArticle[] {
  return legalArticles.filter(article => article.category === category);
}

export function getLegalArticleById(id: string): LegalArticle | undefined {
  return legalArticles.find(article => article.id === id);
}
