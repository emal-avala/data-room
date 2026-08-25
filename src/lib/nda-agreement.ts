import { siteConfig } from "@/config/site";

export const NDA_VERSION = "mutual-v1";

/**
 * Generic mutual NDA. Replace this text with counsel-approved language
 * before you share the room. The signed snapshot is stored in
 * `nda_signature_evidence` so later edits do not rewrite history.
 */
export function getNdaText(): string {
  const company = siteConfig.legalName;
  return `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (this "Agreement") is entered into by and between ${company} ("Company") and the undersigned (the "Receiving Party"), as of the date of signature below.

1. CONFIDENTIAL INFORMATION. "Confidential Information" means any non-public information disclosed by Company to the Receiving Party in connection with the evaluation of a potential investment or business relationship, including without limitation financial statements, cap tables, customer information, pipeline data, product roadmaps, source code, business plans, and any other materials marked or identified as confidential.

2. OBLIGATIONS. The Receiving Party shall (a) hold all Confidential Information in strict confidence, (b) not disclose Confidential Information to any third party without Company's prior written consent, and (c) use Confidential Information solely for the purpose of evaluating the potential transaction.

3. EXCLUSIONS. The obligations above do not apply to information that (a) is or becomes publicly available through no fault of the Receiving Party, (b) was known to the Receiving Party before disclosure, (c) is independently developed without reference to the Confidential Information, or (d) is required to be disclosed by law or court order, provided Company is given prompt notice.

4. TERM. This Agreement remains in effect for two (2) years from the date of signature. The Receiving Party's obligations with respect to trade secrets survive indefinitely.

5. NO LICENSE. Nothing in this Agreement grants any license or right in the Confidential Information other than as expressly set forth here.

6. GOVERNING LAW. This Agreement is governed by the laws of the State of Delaware, without regard to its conflicts-of-laws principles.

SIGNATURES. By clicking "I agree and sign", the Receiving Party acknowledges they have read this Agreement and agree to be bound by its terms.`;
}

export const NDA_TEXT = getNdaText();
