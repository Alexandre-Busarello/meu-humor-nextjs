'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { healthRecordsAPI } from '@/lib/api-client';
import { HealthRecord, CanGenerateRecordResponse } from '@/types';
import { exportHealthRecordToPDF } from '@/lib/utils/pdfExport';
import { timestampToDate } from '@/lib/utils/timezone';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  FileText, 
  Download, 
  AlertCircle, 
  RefreshCw, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Globe,
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { useAuthToken } from '@/components/providers/AuthTokenProvider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function HealthRecordsPage() {
  const { isTokenReady } = useAuthToken();
  const [globalRecord, setGlobalRecord] = useState<HealthRecord | null>(null);
  const [parcialRecords, setParcialRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canGenerate, setCanGenerate] = useState<CanGenerateRecordResponse | null>(null);
  const [expandedGlobal, setExpandedGlobal] = useState(false);
  const [expandedParcials, setExpandedParcials] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<HealthRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isTokenReady) {
      fetchData();
    }
  }, [isTokenReady]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [globalData, parcialsData, canGenerateData] = await Promise.all([
        healthRecordsAPI.getGlobal(),
        healthRecordsAPI.getAllParcial(20),
        healthRecordsAPI.canGenerate(),
      ]);
      setGlobalRecord(globalData);
      setParcialRecords(parcialsData);
      setCanGenerate(canGenerateData);
      setError(null);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError('Erro ao carregar prontuários');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await healthRecordsAPI.generate();
      toast.success('Prontuário gerado com sucesso!');
      await fetchData();
    } catch (err) {
      console.error('Error generating health record:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar prontuário. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteClick = (record: HealthRecord) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    try {
      setIsDeleting(true);
      await healthRecordsAPI.deleteParcial(recordToDelete.id);
      toast.success('Prontuário deletado com sucesso!');
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
      await fetchData();
    } catch (err) {
      console.error('Error deleting health record:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar prontuário.';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportPDF = (record: HealthRecord) => {
    try {
      exportHealthRecordToPDF(record);
      toast.success('PDF exportado com sucesso!');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      toast.error('Erro ao exportar PDF. Tente novamente.');
    }
  };

  const toggleExpandGlobal = () => {
    setExpandedGlobal(!expandedGlobal);
  };

  const toggleExpandParcial = (recordId: string) => {
    const newExpanded = new Set(expandedParcials);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedParcials(newExpanded);
  };

  if (loading) {
    return (
      <div className="container-responsive py-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Prontuários</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
          <p className="text-neutral-600">Carregando prontuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Prontuários</h1>
        <div className="card">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <Button onClick={fetchData} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Prontuários</h1>
      </div>

      {/* Seção 1: Prontuário Global */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6 border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Globe className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 flex items-center gap-2">
                Prontuário Global
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Atualizado automaticamente
                </span>
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Consolidação de todos os seus prontuários parciais
              </p>
            </div>
          </div>
        </div>

        {globalRecord ? (
          <>
            <div className={`text-neutral-700 ${expandedGlobal ? '' : 'line-clamp-6'}`}>
              <div className="prose prose-sm max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {globalRecord.content}
                </ReactMarkdown>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpandGlobal}
              >
                {expandedGlobal ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Ver menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Ver mais
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportPDF(globalRecord)}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>

            <div className="mt-3 text-xs text-neutral-500 flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              Última atualização: {format(timestampToDate(globalRecord.timestamp), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600 mb-2">Nenhum prontuário global ainda</p>
            <p className="text-sm text-neutral-500">
              Gere seu primeiro prontuário parcial para ver o consolidado aqui
            </p>
          </div>
        )}
      </motion.div>

      {/* Seção 2: Status de Geração */}
      {canGenerate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-neutral-800 mb-2">
                Gerar Novo Prontuário Parcial
              </h2>
              
              <div className="space-y-2 text-sm">
                {!canGenerate.isPremium && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {canGenerate.generationsThisMonth}/{canGenerate.monthlyLimit} gerações este mês
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-neutral-600">
                  <FileText className="h-4 w-4" />
                  <span>
                    {canGenerate.newMoodsCount}/{canGenerate.requiredMoods} novos registros de humor (últimos 5 dias)
                  </span>
                </div>
              </div>

              <p className={`text-sm mt-3 ${canGenerate.canGenerate ? 'text-green-600' : 'text-orange-600'}`}>
                {canGenerate.reason}
              </p>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate.canGenerate || isGenerating}
            className="w-full sm:w-auto mt-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Gerar Prontuário
              </>
            )}
          </Button>

          {!canGenerate.isPremium && !canGenerate.canGenerate && canGenerate.generationsThisMonth >= canGenerate.monthlyLimit && (
            <p className="text-xs text-neutral-500 mt-3">
              💡 Dica: Usuários Premium têm prontuários ilimitados!
            </p>
          )}
        </motion.div>
      )}

      {/* Seção 3: Histórico de Parciais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Histórico de Prontuários Parciais
        </h2>

        {parcialRecords.length === 0 ? (
          <div className="card text-center py-12 flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-800 mb-2">
              Nenhum prontuário parcial encontrado
            </h3>
            <p className="text-neutral-600 mb-4">
              Registre seus humores e gere seu primeiro prontuário!
            </p>
            {canGenerate?.canGenerate && (
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? 'Gerando...' : 'Gerar Primeiro Prontuário'}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {parcialRecords.map((record, index) => {
                const isExpanded = expandedParcials.has(record.id);
                const recordDate = format(timestampToDate(record.timestamp), "d 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                          Prontuário Parcial
                          {record.generationMonth && (
                            <span className="text-xs font-normal text-neutral-500">
                              ({record.generationMonth})
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-neutral-500">{recordDate}</p>
                        {record.moodEntryIds.length > 0 && (
                          <p className="text-xs text-neutral-400 mt-1">
                            Baseado em {record.moodEntryIds.length} registro(s) de humor
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={`text-neutral-700 ${isExpanded ? '' : 'line-clamp-4'}`}>
                      <div className="prose prose-sm max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {record.content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpandParcial(record.id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Ver menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Ver mais
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportPDF(record)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(record)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Modal de Confirmação de Deleção */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Deleção</DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>Tem certeza que deseja deletar este prontuário parcial?</p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
                <p className="font-medium mb-2">⚠️ Atenção:</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Os registros de humor deste período serão desconsiderados</li>
                  <li>O prontuário global será atualizado automaticamente</li>
                  <li>Esta ação <strong>NÃO recupera</strong> o slot de geração mensal</li>
                  <li>Esta ação não pode ser desfeita</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deletando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar Prontuário
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
