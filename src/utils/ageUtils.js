/**
 * Valida e converte a data de nascimento para objeto Date
 * @param {string|Date} birthDate - Data no formato YYYY-MM-DD ou objeto Date
 * @returns {Date} Objeto Date válido
 * @throws {Error} Se a data for inválida
 */
export function parseBirthDate(birthDate) {
  if (birthDate instanceof Date) {
    if (isNaN(birthDate.getTime())) {
      throw new Error('Objeto Date inválido');
    }
    return birthDate;
  }

  // Verifica formato de string (YYYY-MM-DD)
  if (typeof birthDate === 'string') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      throw new Error('Formato de data inválido. Use YYYY-MM-DD');
    }
    
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      throw new Error('Data de nascimento inválida');
    }
    
    // Verifica se a data não é no futuro
    if (date > new Date()) {
      throw new Error('Data de nascimento não pode ser no futuro');
    }
    
    return date;
  }

  throw new Error('Tipo de data não suportado');
}

/**
 * Calcula idade a partir de uma data de nascimento
 * @param {string|Date} birthDate - Data no formato YYYY-MM-DD ou objeto Date
 * @returns {number} Idade em anos
 * @throws {Error} Se a data for inválida
 */
export function calculateAge(birthDate) {
  try {
    const birthDateObj = parseBirthDate(birthDate);
    const today = new Date();
    
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || 
        (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return Math.max(0, age); // Garante que não retorne idade negativa
  } catch (error) {
    console.error('Erro ao calcular idade:', error.message);
    throw error; // Propaga o erro para o chamador
  }
}

/**
 * Valida se o usuário tem idade mínima requerida
 * @param {string|Date} birthDate - Data de nascimento
 * @param {number} minAge - Idade mínima requerida
 * @returns {boolean} True se a idade for >= minAge
 * @throws {Error} Se a data for inválida
 */
export function validateMinimumAge(birthDate, minAge) {
  if (minAge < 0) {
    throw new Error('Idade mínima não pode ser negativa');
  }
  return calculateAge(birthDate) >= minAge;
}

/**
 * Formata idade para exibição
 * @param {number} age - Idade em anos
 * @returns {string} Idade formatada (ex: "25 anos")
 * @throws {Error} Se a idade for negativa.
 */
export function formatAge(age) {
  if (age < 0) {
    throw new Error('Idade não pode ser negativa');
  }
  
  return `${age} ${age === 1 ? 'ano' : 'anos'}`;
}