export const uploadImageToStorage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Nenhum arquivo fornecido'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Arquivo deve ser uma imagem'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      reject(new Error('Imagem muito grande. Máximo 5MB'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Arquivo deve ser uma imagem' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'Imagem muito grande. Máximo 5MB' };
  }

  return { isValid: true };
};
