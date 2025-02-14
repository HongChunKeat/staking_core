import bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * generate hash from password or string
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * generate random code from string
 */
export function randomCode(
  length: number = 16,
  type: string = 'mixed-upper',
): string {
  let selections: string;
  switch (type) {
    case 'int':
      selections = '0123456789';
      break;

    case 'string':
      selections = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;

    case 'string-upper':
      selections = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;

    case 'string-lower':
      selections = 'abcdefghijklmnopqrstuvwxyz';
      break;

    case 'mixed-upper':
      selections = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;

    case 'mixed-lower':
      selections = '0123456789abcdefghijklmnopqrstuvwxyz';
      break;

    case 'mixed':
    default:
      selections =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;
  }

  const range = selections.length;
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += selections.charAt(Math.floor(Math.random() * range));
  }

  return randomString;
}

/**
 * validate text with hash
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(
  getVar: () => TResult,
): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];
  const memberParts = fullMemberName.split('.');
  return memberParts.at(-1);
}

/**
 * openssl encrypt
 * * generate key from here
 */
export async function opensslEncrypt(text: string): Promise<string> {
  let result = '';
  // gen new key
  // let key = crypto.createHash('sha256').update("").digest('base64').substr(0, 32);
  const key = process.env.OPEN_SSL_KEY;
  if (key !== undefined) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    result = iv.toString('hex') + ':' + encrypted;
  }
  return result;
}

/**
 * openssl decrypt
 */
export async function opensslDecrypt(encryptedText: string): Promise<string> {
  let result = '';
  const key = process.env.OPEN_SSL_KEY;
  if (key !== undefined) {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts[0], 'hex');
    const encrypted = textParts.slice(1).join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    result = decrypted;
  }
  return result;
}
