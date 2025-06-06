import React, { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Filter, MessageCircle, Home, Bed, Bath, Square, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PropertyDetails from "../property/PropertyDetails";

// Componente para o mapa de propriedades
const PropertyMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filter, setFilter] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dados mockados de propriedades
  const properties = [
    {
      id: "1",
      title: "Apartamento Moderno - Vila Mariana",
      address: "Rua Domingos de Morais, 1500, São Paulo",
      price: 850000,
      bedrooms: 3,
      bathrooms: 2,
      area: 78,
      position: { top: "30%", left: "45%" },
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=2070",
    },
    {
      id: "2",
      title: "Apartamento Estilo Industrial - Pinheiros",
      address: "Rua Fradique Coutinho, 320, São Paulo",
      price: 720000,
      bedrooms: 2,
      bathrooms: 1,
      area: 65,
      position: { top: "60%", left: "30%" },
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070",
    },
    {
      id: "3",
      title: "Cobertura Duplex - Moema",
      address: "Alameda dos Maracatins, 780, São Paulo",
      price: 1450000,
      bedrooms: 4,
      bathrooms: 3,
      area: 180,
      position: { top: "40%", left: "70%" },
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1980",
    },
  ];

  useEffect(() => {
    // Simulação de carregamento do mapa
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleScheduleVisit = () => {
    setShowPropertyDetails(false);
    setShowScheduleDialog(true);
  };

  const handleConfirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione data e horário para agendar a visita.",
        variant: "destructive",
      });
      return;
    }

    // Simular cadastro de agendamento
    toast({
      title: "Agendamento confirmado!",
      description: `Sua visita ao imóvel ${selectedProperty?.title} está agendada para ${scheduleDate} às ${scheduleTime}.`,
      variant: "default",
    });

    setShowScheduleDialog(false);
    setScheduleDate("");
    setScheduleTime("");
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      {/* Overlay de carregamento */}
      {loading && (
        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <Loader2 className="h-10 w-10 text-estate-primary animate-spin" />
            <p className="text-lg font-medium">Carregando mapa...</p>
          </div>
        </div>
      )}
      
      {/* Container do mapa (imagem estática) */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full bg-slate-100 relative overflow-hidden"
      >
        <img 
          src="/mapa-estatico-pedro-andre.jpg" 
          alt="Mapa Estático" 
          className="w-full h-full object-cover"
        />
        
        {/* Marcadores de imóveis no mapa */}
        {properties.map((property) => (
          <button 
            key={property.id}
            className="absolute z-10 bg-estate-primary text-white rounded-full p-1 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ top: property.position.top, left: property.position.left }}
            onClick={() => handlePropertyClick(property)}
            aria-label={`Imóvel: ${property.title}`}
          >
            <MapPin className="h-6 w-6" />
          </button>
        ))}
      </div>
      
      {/* Botão de filtro */}
      <div className="absolute top-4 right-4 z-20">
        <Button 
          className="bg-white text-estate-dark hover:bg-slate-50 hover:shadow-md transition-all duration-300 rounded-lg border border-slate-200 font-medium"
          onClick={() => setShowFilterDialog(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          <span>Filtros</span>
        </Button>
      </div>
      
      {/* Ícone flutuante do assistente */}
      <div className="absolute bottom-6 right-6 z-30">
        <Button 
          onClick={() => setChatOpen(true)}
          className="h-14 w-14 rounded-full bg-estate-primary hover:bg-estate-secondary shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Abrir assistente"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
      
      {/* Dialog do assistente */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="assistant-dialog-description">
          <DialogHeader>
            <DialogTitle>Assistente Pedro André Negócios Imobiliários</DialogTitle>
            <DialogDescription id="assistant-dialog-description">
              Nosso assistente virtual está pronto para ajudar com suas buscas.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-estate-primary" />
            <p className="text-lg font-medium">Em breve, nosso assistente IA vai te ajudar aqui!</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de detalhes da propriedade */}
      <Dialog open={showPropertyDetails} onOpenChange={setShowPropertyDetails}>
        <DialogContent className="sm:max-w-3xl" aria-describedby="property-details-description">
          <DialogDescription id="property-details-description" className="sr-only">
            Detalhes completos do imóvel selecionado
          </DialogDescription>
          {selectedProperty && (
            <PropertyDetails 
              property={selectedProperty} 
              onScheduleVisit={handleScheduleVisit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de agendamento de visita */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby="schedule-dialog-description">
          <DialogHeader>
            <DialogTitle>Agendar Visita</DialogTitle>
            <DialogDescription id="schedule-dialog-description">
              Escolha a data e horário para visitar o imóvel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Data
              </label>
              <input 
                type="date" 
                id="date" 
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Horário
              </label>
              <select 
                id="time" 
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="">Selecione um horário</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmSchedule}
              className="bg-estate-primary hover:bg-estate-secondary"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de filtros */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby="filter-dialog-description">
          <DialogHeader>
            <DialogTitle>Filtrar Imóveis</DialogTitle>
            <DialogDescription id="filter-dialog-description">
              Defina os critérios para filtrar os imóveis exibidos no mapa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="minPrice" className="text-sm font-medium">Preço mínimo</label>
              <input
                type="number"
                id="minPrice"
                value={filter.minPrice}
                onChange={e => setFilter(f => ({ ...f, minPrice: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Ex: 200000"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="maxPrice" className="text-sm font-medium">Preço máximo</label>
              <input
                type="number"
                id="maxPrice"
                value={filter.maxPrice}
                onChange={e => setFilter(f => ({ ...f, maxPrice: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Ex: 800000"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bedrooms" className="text-sm font-medium">Quartos</label>
              <input
                type="number"
                id="bedrooms"
                value={filter.bedrooms}
                onChange={e => setFilter(f => ({ ...f, bedrooms: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Ex: 3"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bathrooms" className="text-sm font-medium">Banheiros</label>
              <input
                type="number"
                id="bathrooms"
                value={filter.bathrooms}
                onChange={e => setFilter(f => ({ ...f, bathrooms: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Ex: 2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => setShowFilterDialog(false)}
              className="bg-estate-primary hover:bg-estate-secondary"
            >
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyMap;
