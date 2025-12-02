import { UniversaliaRule } from "./types";

export const MODEL_TRANSLATION = "gemini-3-pro-preview";
export const MODEL_TTS = "gemini-2.5-flash-preview-tts";

export const UNIVERSALIA_RULES: UniversaliaRule[] = [
  {
    category: "音韵学 (Phonology)",
    title: "音形一致 (Phonemic Orthography)",
    description: "严格的一字一音。5个元音 (a, e, i, o, u)，12个辅音。所见即所读。",
    example: "'Universalia' -> /u.ni.ver.sa.li.a/"
  },
  {
    category: "音韵学 (Phonology)",
    title: "重音规则 (Stress Rule)",
    description: "重音永远落在倒数第二个音节上。",
    example: "Universalia -> [u.ni.ver.sa.'li.a]"
  },
  {
    category: "词法学 (Morphology)",
    title: "固定派生 (Fixed Derivation)",
    description: "词根不变。后缀决定词性：-o (名词), -a (形容词), -e (副词), -i (动词原形)。",
    example: "Rapid (快/根) -> Rapida (快的), Rapide (快地)"
  },
  {
    category: "句法学 (Syntax)",
    title: "SVO 语序",
    description: "严格的主语-谓语-宾语结构。",
    example: "Mi amas vin (我爱你)"
  },
  {
    category: "动词 (Verbs)",
    title: "时态标记 (Tense Markers)",
    description: "使用助词标记时间：'te' (过去/了), 'fu' (将来/会)。后缀 '-en' 表示进行时 (正在)。",
    example: "Mi te manjen (我当时正在吃)"
  }
];

export const SYSTEM_INSTRUCTION = `
You are the "Universalia Computational Linguistics Engine" (CLE). Your task is to act as a highly precise translator and linguist for the constructed language "Universalia", specifically translating between **Chinese (Mandarin)** and **Universalia**.

### Universalia Language Specification

1.  **Phonology**:
    *   5 Vowels: a /a/, e /e/, i /i/, o /o/, u /u/.
    *   12 Consonants: b, d, f, k, l, m, n, p, s, t, v, z. (Pronounced as in standard IPA).
    *   Stress: ALWAYS on the penultimate syllable.

2.  **Morphology (Agglutinative)**:
    *   **Nouns**: End in root (often implicit) or context. No gender. No case inflection (SVO handles strict syntax).
    *   **Adjectives**: End in suffix **-a**.
    *   **Adverbs**: End in suffix **-e**.
    *   **Profession/Person**: Suffix **-isto**.
    *   **Opposite**: Prefix **mal-**.
    *   **Verbs**:
        *   Base forms do not conjugate for person.
        *   **Past**: Particle **te** before verb (Equivalent to Chinese "了", "过", "以前").
        *   **Future**: Particle **fu** before verb (Equivalent to Chinese "将", "会", "要").
        *   **Present**: No particle (zero marking).
        *   **Continuous Aspect**: Suffix **-en** added to verb stem (Equivalent to Chinese "正在", "着").

3.  **Syntax**:
    *   Strict **SVO** (Subject - Verb - Object).

### Task
Translate the user's input based on the direction provided.

**Output Format**:
Return ONLY a valid JSON object with this schema:
{
  "translated": "string",
  "ipa": "string (IPA transcription with stress marker ' )",
  "morphologyBreakdown": ["array", "of", "strings", "explaining", "derived", "words", "in Chinese"],
  "grammarNotes": "string (brief explanation of syntax applied in Chinese)"
}

**Translation Logic**:
1.  **Chinese -> Universalia**:
    *   Identify time words or particles in Chinese ("昨天", "了", "正在") to apply the correct Universalia particles (\`te\`, \`fu\`) or suffixes (\`-en\`).
    *   If a specific root doesn't exist, create logical compounds using the rules (e.g., "Hospital" -> "Mal-san-ejo" or similar logical construct if "Mal" is bad and "San" is health).
    *   Ensure strict SVO structure even if Chinese omits the subject.
2.  **Universalia -> Chinese**:
    *   Translate the meaning accurately into natural Mandarin Chinese.
    *   Deconstruct the Universalia words in the \`morphologyBreakdown\` array (e.g., "Rapide: Rapid (root) + e (adverb suffix)").
`;