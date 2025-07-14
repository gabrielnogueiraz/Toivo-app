// Frases de abertura variadas para a Lumi
export const lumiGreetings = [
  {
    title: "Olá, {name}! Como você está hoje? ✨",
    description: "Estou aqui para ajudar você a ser mais produtivo e organizado."
  },
  {
    title: "Oi, {name}! Pronto para um dia incrível? 🚀",
    description: "Vamos juntos transformar suas ideias em conquistas reais."
  },
  {
    title: "E aí, {name}! Tudo bem? 💫",
    description: "Como posso contribuir com sua produtividade hoje?"
  },
  {
    title: "Olá, {name}! Por onde vamos começar? 🌟",
    description: "Estou aqui para organizar suas tarefas e potencializar seus resultados."
  },
  {
    title: "Oi, {name}! Como posso te ajudar hoje? ⚡",
    description: "Vamos criar um fluxo de trabalho que realmente funciona para você."
  },
  {
    title: "E aí, {name}! Preparado para mais um dia produtivo? ✨",
    description: "Juntos podemos transformar metas em conquistas concretas."
  },
  {
    title: "Olá, {name}! Que bom te ver por aqui! 📈",
    description: "Como posso ajudar você a alcançar seus objetivos hoje?"
  },
  {
    title: "Oi, {name}! Vamos fazer acontecer? 🎯",
    description: "Estou pronta para ser sua parceira na jornada do sucesso."
  },
  {
    title: "E aí, {name}! Como está se sentindo hoje? 🆙",
    description: "Vamos organizar, priorizar e executar com excelência?"
  },
  {
    title: "Olá, {name}! Qual é o plano para hoje? 💡",
    description: "Estou aqui para ajudar você a descobrir seu potencial máximo."
  }
];

// Função para obter uma saudação aleatória
export const getRandomGreeting = (userName: string = 'usuário') => {
  const randomIndex = Math.floor(Math.random() * lumiGreetings.length);
  const greeting = lumiGreetings[randomIndex];
  return {
    title: greeting.title.replace('{name}', userName),
    description: greeting.description
  };
};

// Função para obter uma saudação baseada no horário
export const getTimeBasedGreeting = (userName: string = 'usuário') => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    // Manhã - saudações mais energéticas
    const morningGreetings = lumiGreetings.filter((_, index) => [1, 4, 6, 9].includes(index));
    const greeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
    return {
      title: greeting.title.replace('{name}', userName),
      description: greeting.description
    };
  } else if (hour >= 12 && hour < 18) {
    // Tarde - saudações focadas em produtividade
    const afternoonGreetings = lumiGreetings.filter((_, index) => [3, 6, 7].includes(index));
    const greeting = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
    return {
      title: greeting.title.replace('{name}', userName),
      description: greeting.description
    };
  } else {
    // Noite - saudações mais suaves
    const eveningGreetings = lumiGreetings.filter((_, index) => [0, 2, 5, 8].includes(index));
    const greeting = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
    return {
      title: greeting.title.replace('{name}', userName),
      description: greeting.description
    };
  }
};
