'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Settings, Store, Mail, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { settingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ConfiguracionPage() {
  const queryClient = useQueryClient();
  
  const [generalSettings, setGeneralSettings] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
  });

  const [shippingSettings, setShippingSettings] = useState({
    shippingCost: '',
    freeShippingMinimum: '',
    estimatedDeliveryDays: '',
  });

  const { isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await settingsApi.get();
      const settings = response.data || [];
      
      // Map settings to state
      const settingsMap: Record<string, string> = {};
      settings.forEach((s: any) => {
        settingsMap[s.key] = s.value;
      });

      setGeneralSettings({
        storeName: settingsMap.storeName || 'AKEMY',
        storeDescription: settingsMap.storeDescription || '',
        storeEmail: settingsMap.storeEmail || '',
        storePhone: settingsMap.storePhone || '',
        storeAddress: settingsMap.storeAddress || '',
      });

      setShippingSettings({
        shippingCost: settingsMap.shippingCost || '10',
        freeShippingMinimum: settingsMap.freeShippingMinimum || '100',
        estimatedDeliveryDays: settingsMap.estimatedDeliveryDays || '3-5',
      });

      return settings;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (settings: Array<{ key: string; value: string }>) =>
      settingsApi.updateMany(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });

  const handleSaveGeneral = async () => {
    try {
      await updateMutation.mutateAsync([
        { key: 'storeName', value: generalSettings.storeName },
        { key: 'storeDescription', value: generalSettings.storeDescription },
        { key: 'storeEmail', value: generalSettings.storeEmail },
        { key: 'storePhone', value: generalSettings.storePhone },
        { key: 'storeAddress', value: generalSettings.storeAddress },
      ]);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración');
    }
  };

  const handleSaveShipping = async () => {
    try {
      await updateMutation.mutateAsync([
        { key: 'shippingCost', value: shippingSettings.shippingCost },
        { key: 'freeShippingMinimum', value: shippingSettings.freeShippingMinimum },
        { key: 'estimatedDeliveryDays', value: shippingSettings.estimatedDeliveryDays },
      ]);
      toast.success('Configuración de envíos guardada');
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      toast.error('Error al guardar la configuración');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la configuración de tu tienda
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Store className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="h-4 w-4" />
            Envíos
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información de la tienda</CardTitle>
              <CardDescription>
                Configura la información básica de tu tienda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nombre de la tienda</Label>
                  <Input
                    id="storeName"
                    value={generalSettings.storeName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeName: e.target.value,
                      })
                    }
                    placeholder="AKEMY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email de contacto</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeEmail: e.target.value,
                      })
                    }
                    placeholder="contacto@akemy.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Descripción</Label>
                <Textarea
                  id="storeDescription"
                  value={generalSettings.storeDescription}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      storeDescription: e.target.value,
                    })
                  }
                  placeholder="Tu papelería y librería favorita..."
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Teléfono</Label>
                  <Input
                    id="storePhone"
                    value={generalSettings.storePhone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storePhone: e.target.value,
                      })
                    }
                    placeholder="+51 999 999 999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Dirección</Label>
                  <Input
                    id="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeAddress: e.target.value,
                      })
                    }
                    placeholder="Av. Principal 123, Lima"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral} disabled={updateMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de envíos</CardTitle>
              <CardDescription>
                Configura los costos y tiempos de envío
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Costo de envío (S/)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={shippingSettings.shippingCost}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        shippingCost: e.target.value,
                      })
                    }
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingMinimum">
                    Envío gratis desde (S/)
                  </Label>
                  <Input
                    id="freeShippingMinimum"
                    type="number"
                    value={shippingSettings.freeShippingMinimum}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        freeShippingMinimum: e.target.value,
                      })
                    }
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedDeliveryDays">
                    Días estimados de entrega
                  </Label>
                  <Input
                    id="estimatedDeliveryDays"
                    value={shippingSettings.estimatedDeliveryDays}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        estimatedDeliveryDays: e.target.value,
                      })
                    }
                    placeholder="3-5"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveShipping} disabled={updateMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
