import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAuthToken } from '@/services/api';
import { createLumiService } from '@/services/lumi';
import { createLumiServiceWithFallback } from '@/services/lumi/mockLumiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, MessageCircle, User, Shield } from 'lucide-react';

const LumiTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Olá Lumi! Como você está?');
  const [response, setResponse] = useState('');

  // Verificar autenticação ao carregar
  useEffect(() => {
    if (isAuthenticated) {
      runInitialTests();
    }
  }, [isAuthenticated]);

  const runInitialTests = async () => {
    setLoading(true);
    const results: Record<string, any> = {};

    try {
      // Teste 1: Verificar token JWT
      const token = getAuthToken();
      results.tokenCheck = {
        success: !!token,
        message: token ? 'Token JWT encontrado' : 'Token JWT não encontrado',
        data: token ? { hasToken: true, tokenLength: token.length } : null
      };

      // Teste 2: Decodificar token (apenas payload)
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          results.tokenDecode = {
            success: true,
            message: 'Token decodificado com sucesso',
            data: payload
          };
        } catch (error) {
          results.tokenDecode = {
            success: false,
            message: 'Erro ao decodificar token',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      }

      // Teste 3: Criar serviço Lumi
      const lumiService = createLumiServiceWithFallback();
      results.serviceCreation = {
        success: !!lumiService,
        message: lumiService ? 'Serviço Lumi criado com sucesso' : 'Falha ao criar serviço Lumi'
      };

      // Teste 4: Verificar saúde da API
      if (lumiService) {
        try {
          const isHealthy = await lumiService.checkHealth();
          results.healthCheck = {
            success: isHealthy,
            message: isHealthy ? 'API da Lumi está funcionando' : 'API da Lumi não está respondendo'
          };
        } catch (error) {
          results.healthCheck = {
            success: false,
            message: 'Erro ao verificar saúde da API',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      }

      // Teste 5: Validar token
      if (lumiService) {
        try {
          const isValid = await lumiService.validateToken();
          results.tokenValidation = {
            success: isValid,
            message: isValid ? 'Token é válido' : 'Token é inválido'
          };
        } catch (error) {
          results.tokenValidation = {
            success: false,
            message: 'Erro ao validar token',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      }

      setTestResults(results);
    } catch (error) {
      console.error('Erro nos testes:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const lumiService = createLumiServiceWithFallback();
      const lumiMessage = await lumiService.sendMessage(message);
      setResponse(lumiMessage.content);
    } catch (error) {
      setResponse(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const testStreamMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const lumiService = createLumiServiceWithFallback();
      await lumiService.sendMessageStream(
        message,
        (chunk: string) => {
          setResponse(prev => prev + chunk);
        },
        () => {
          setLoading(false);
        },
        (error: Error) => {
          setResponse(`Erro: ${error.message}`);
          setLoading(false);
        }
      );
    } catch (error) {
      setResponse(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setLoading(false);
    }
  };

  const renderTestResult = (testName: string, result: any) => {
    if (!result) return null;

    return (
      <div key={testName} className="space-y-2">
        <div className="flex items-center gap-2">
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="font-medium">{testName}</span>
          <Badge variant={result.success ? "default" : "destructive"}>
            {result.success ? 'Passou' : 'Falhou'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground pl-6">{result.message}</p>
        {result.data && (
          <pre className="text-xs bg-muted p-2 rounded ml-6 overflow-x-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        )}
        {result.error && (
          <Alert className="ml-6">
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Teste de Autenticação JWT - Lumi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Você precisa estar logado no Toivo para testar a integração JWT com a Lumi.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Teste de Integração JWT - Toivo + Lumi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Usuário logado: <strong>{user?.name}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Status: <strong>{isAuthenticated ? 'Autenticado' : 'Não autenticado'}</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados dos Testes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Executando testes...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(testResults).map(([testName, result]) => 
                renderTestResult(testName, result)
              )}
              {Object.keys(testResults).length === 0 && (
                <p className="text-muted-foreground">Execute os testes para ver os resultados</p>
              )}
            </div>
          )}
          <div className="mt-4">
            <Button onClick={runInitialTests} disabled={loading}>
              {loading ? 'Executando...' : 'Executar Testes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teste de Mensagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Mensagem para a Lumi:
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testSendMessage} disabled={loading || !message.trim()}>
              {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
            <Button onClick={testStreamMessage} disabled={loading || !message.trim()} variant="outline">
              {loading ? 'Enviando...' : 'Enviar com Stream'}
            </Button>
          </div>

          {response && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Resposta da Lumi:
              </label>
              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LumiTest;
