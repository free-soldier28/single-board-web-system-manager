function splitEscaped(str) {
  const result = [];
  let current = '';
  let escape = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escape) {
      current += ch;
      escape = false;
    } else if (ch === '\\') {
      escape = true;
    } else if (ch === ':') {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

module.exports = { splitEscaped };
