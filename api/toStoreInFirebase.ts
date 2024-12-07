export function decryptText(str: string){
    return str.replaceAll('✦', '\n');
}

export function encryptText(str: string){
    return str.replaceAll('\n', '✦')
}