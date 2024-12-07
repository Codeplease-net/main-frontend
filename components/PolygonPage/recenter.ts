export function splitString(str: string) {
    const pattern = /\{([^{}]*)\}/g;

    let matches = [];
    let match;
    while ((match = pattern.exec(str)) !== null) matches.push(match[0]);

    matches = matches.map(text => text.slice(1, -1))
    return matches
}