import { motion } from 'framer-motion';
import { BarChart3, Timer, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="h-full p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Visão geral da sua produtividade e progresso
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="touch-target">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Pomodoros Hoje
              </CardTitle>
              <Timer className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                de 8 planejados
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="touch-target">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Tarefas Concluídas
              </CardTitle>
              <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                +0% desde ontem
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="touch-target">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Tempo Focado
              </CardTitle>
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">0h</div>
              <p className="text-xs text-muted-foreground">
                esta semana
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="touch-target">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Produtividade
              </CardTitle>
              <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                média semanal
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center h-48 md:h-64"
      >
        <div className="text-center px-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
          <h3 className="text-base md:text-lg font-semibold mb-2">
            Dashboard em Desenvolvimento
          </h3>
          <p className="text-muted-foreground max-w-md text-sm md:text-base">
            Em breve você terá acesso a relatórios detalhados, gráficos de produtividade e muito mais.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
