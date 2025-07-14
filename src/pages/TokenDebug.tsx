import React, { useEffect, useState } from 'react';
import { getAuthToken } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Página de diagnóstico para depurar problemas de autenticação com a API da Lumi
 */
const TokenDebug: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [fixedToken, setFixedToken] = useState<string | null>(null);

  useEffect(() => {
    analyzeToken();
  }, []);

  const analyzeToken = () => {
    const token = getAuthToken();
    
    if (!token) {
      setTokenInfo({
        exists: false,
        message: "Nenhum token encontrado no localStorage"
      });
      return;
    }

    // Analisar o token
    try {
      let cleanToken = token;
      
      // Verificar se o token tem aspas extras
      const hasQuotes = token.startsWith('"') && token.endsWith('"');
      if (hasQuotes) {
        cleanToken = token.slice(1, -1);
        // Salvar o token corrigido
        setFixedToken(cleanToken);
      }
      
      // Tentar decodificar o payload
      const parts = cleanToken.split('.');
      const payload = parts.length >= 2 ? 
        JSON.parse(atob(parts[1])) : 
        "Impossível decodificar payload";
      
      setTokenInfo({
        exists: true,
        token: {
          original: token,
          cleaned: cleanToken,
        },
        analysis: {
          length: token.length,
          hasQuotes,
          parts: parts.length,
          isValidFormat: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(cleanToken),
        },
        authHeader: `Bearer ${cleanToken}`,
        payload
      });
    } catch (err) {
      setTokenInfo({
        exists: true,
        error: err instanceof Error ? err.message : "Erro desconhecido",
        token: {
          original: token
        }
      });
    }
  };

  // Função para corrigir o token
  const fixToken = () => {
    if (fixedToken && tokenInfo?.analysis?.hasQuotes) {
      // Armazenar o token sem as aspas
      localStorage.setItem('toivo_access_token', fixedToken);
      // Atualizar a análise
      analyzeToken();
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <h1 className="text-2xl font-bold">Diagnóstico do Token JWT</h1>
      
      {!tokenInfo && (
        <Alert>
          <AlertDescription>
            Analisando token...
          </AlertDescription>
        </Alert>
      )}
      
      {tokenInfo?.exists === false && (
        <Alert variant="destructive">
          <AlertDescription>
            {tokenInfo.message}
          </AlertDescription>
        </Alert>
      )}
      
      {tokenInfo?.exists && !tokenInfo.error && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Estado do Token
                <Badge variant={tokenInfo.analysis.isValidFormat ? "default" : "destructive"} className={tokenInfo.analysis.isValidFormat ? "bg-green-500" : ""}>
                  {tokenInfo.analysis.isValidFormat ? "Válido" : "Inválido"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Análise:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Comprimento: {tokenInfo.analysis.length} caracteres</li>
                  <li>Partes: {tokenInfo.analysis.parts} (deve ser 3)</li>
                  <li>Aspas extras: {tokenInfo.analysis.hasQuotes ? "Sim ⚠️" : "Não ✅"}</li>
                  <li>Formato JWT válido: {tokenInfo.analysis.isValidFormat ? "Sim ✅" : "Não ⚠️"}</li>
                </ul>
              </div>
              
              {tokenInfo.analysis.hasQuotes && (
                <div>
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>
                      O token está armazenado com aspas extras, o que pode causar problemas de autenticação.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={fixToken}>Corrigir Token</Button>
                </div>
              )}
              
              <div>
                <h3 className="font-medium mb-1">Header de Autorização:</h3>
                <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                  {tokenInfo.authHeader}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Payload decodificado:</h3>
                <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                  {JSON.stringify(tokenInfo.payload, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Token original (localStorage):</h3>
                <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs whitespace-pre-wrap">
                  {tokenInfo.token.original}
                </pre>
              </div>
              
              {tokenInfo.analysis.hasQuotes && (
                <div>
                  <h3 className="font-medium mb-1">Token sem aspas:</h3>
                  <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs whitespace-pre-wrap">
                    {tokenInfo.token.cleaned}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      
      {tokenInfo?.error && (
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao analisar token: {tokenInfo.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TokenDebug;
