// Frases de abertura variadas para a Lumi
export const LUMI_GREETINGS = [
  {
    title: "Olá, {name}! Como você está hoje?",
    subtitle: "Estou aqui para te ajudar a ter um dia mais produtivo."
  },
  {
    title: "Bem-vindo de volta, {name}!",
    subtitle: "Pronto para mais um dia de conquistas?"
  },
  {
    title: "Oi, {name}! Como posso te ajudar hoje?",
    subtitle: "Estou aqui para tornar seu dia mais produtivo."
  },
  {
    title: "E aí, {name}! Preparado para mais um dia produtivo?",
    subtitle: "Vamos juntos alcançar seus objetivos."
  }
];

// Função para obter uma saudação aleatória
export const getRandomGreeting = (userName: string = 'usuário') => {
  const randomIndex = Math.floor(Math.random() * LUMI_GREETINGS.length);
  const greeting = LUMI_GREETINGS[randomIndex];
  return {
    title: greeting.title.replace('{name}', userName),
    description: greeting.subtitle
  };
};

// Função para obter uma saudação baseada no horário
export const getTimeBasedGreeting = (userName: string = 'usuário') => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    // Manhã - saudações mais energéticas
    const morningGreetings = LUMI_GREETINGS.filter((_, index) => [1, 4, 6, 9].includes(index));
    const greeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
    return {
      title: greeting.title.replace('{name}', userName),
      description: greeting.subtitle
    };
  } else if (hour >= 12 && hour < 18) {
    // Tarde - saudações focadas em produtividade
    const afternoonGreetings = LUMI_GREETINGS.filter((_, index) => [3, 6, 7].includes(index));
    const greeting = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
    return {
      title: greeting.title.replace('{name}', userName),
      description: greeting.subtitle
    };
  } else {
    // Noite - saudações mais suaves
    const eveningGreetings = LUMI_GREETINGS.filter((_, index) => [0, 2, 5, 8].includes(index));
    const greeting = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
    return {
      title: greeting.title.replace('{name}', userName),
      description: greeting.subtitle
    };
  }
};
