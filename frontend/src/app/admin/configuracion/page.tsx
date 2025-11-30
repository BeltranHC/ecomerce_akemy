'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Settings, Store, Mail, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';
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
    pickupAddress: '',
    pickupSchedule: '',
    pickupPhone: '',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    // Yape
    yapeEnabled: 'true',
    yapePhone: '',
    yapeName: '',
    // Bank Transfer
    transferEnabled: 'true',
    bankName: '',
    bankAccountNumber: '',
    bankCCI: '',
    bankAccountHolder: '',
    // PayPal
    paypalEnabled: 'true',
    paypalEmail: '',
    // Card
    cardEnabled: 'false',
    cardProvider: '',
    // Cash
    cashEnabled: 'true',
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
        pickupAddress: settingsMap.pickupAddress || 'Av. Principal 123, Lima',
        pickupSchedule: settingsMap.pickupSchedule || 'Lun - Sáb: 9:00 AM - 7:00 PM',
        pickupPhone: settingsMap.pickupPhone || '',
      });

      setPaymentSettings({
        // Yape
        yapeEnabled: settingsMap.yapeEnabled || 'true',
        yapePhone: settingsMap.yapePhone || '',
        yapeName: settingsMap.yapeName || '',
        // Bank Transfer
        transferEnabled: settingsMap.transferEnabled || 'true',
        bankName: settingsMap.bankName || '',
        bankAccountNumber: settingsMap.bankAccountNumber || '',
        bankCCI: settingsMap.bankCCI || '',
        bankAccountHolder: settingsMap.bankAccountHolder || '',
        // PayPal
        paypalEnabled: settingsMap.paypalEnabled || 'true',
        paypalEmail: settingsMap.paypalEmail || '',
        // Card
        cardEnabled: settingsMap.cardEnabled || 'false',
        cardProvider: settingsMap.cardProvider || '',
        // Cash
        cashEnabled: settingsMap.cashEnabled || 'true',
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
        { key: 'pickupAddress', value: shippingSettings.pickupAddress },
        { key: 'pickupSchedule', value: shippingSettings.pickupSchedule },
        { key: 'pickupPhone', value: shippingSettings.pickupPhone },
      ]);
      toast.success('Configuración de tienda guardada');
    } catch (error) {
      console.error('Error saving pickup settings:', error);
      toast.error('Error al guardar la configuración');
    }
  };

  const handleSavePayments = async () => {
    try {
      await updateMutation.mutateAsync([
        // Yape
        { key: 'yapeEnabled', value: paymentSettings.yapeEnabled },
        { key: 'yapePhone', value: paymentSettings.yapePhone },
        { key: 'yapeName', value: paymentSettings.yapeName },
        // Bank Transfer
        { key: 'transferEnabled', value: paymentSettings.transferEnabled },
        { key: 'bankName', value: paymentSettings.bankName },
        { key: 'bankAccountNumber', value: paymentSettings.bankAccountNumber },
        { key: 'bankCCI', value: paymentSettings.bankCCI },
        { key: 'bankAccountHolder', value: paymentSettings.bankAccountHolder },
        // PayPal
        { key: 'paypalEnabled', value: paymentSettings.paypalEnabled },
        { key: 'paypalEmail', value: paymentSettings.paypalEmail },
        // Card
        { key: 'cardEnabled', value: paymentSettings.cardEnabled },
        { key: 'cardProvider', value: paymentSettings.cardProvider },
        // Cash
        { key: 'cashEnabled', value: paymentSettings.cashEnabled },
      ]);
      toast.success('Configuración de pagos guardada');
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error('Error al guardar la configuración de pagos');
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
            <Store className="h-4 w-4" />
            Tienda
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Pagos
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

        {/* Shipping Settings - Ahora es Recojo en Tienda */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Recojo en Tienda</CardTitle>
              <CardDescription>
                Configura la información de tu tienda física para el recojo de pedidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Dirección de la tienda</Label>
                  <Input
                    id="pickupAddress"
                    value={shippingSettings.pickupAddress}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        pickupAddress: e.target.value,
                      })
                    }
                    placeholder="Av. Principal 123, Lima"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pickupSchedule">Horario de atención</Label>
                    <Input
                      id="pickupSchedule"
                      value={shippingSettings.pickupSchedule}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          pickupSchedule: e.target.value,
                        })
                      }
                      placeholder="Lun - Sáb: 9:00 AM - 7:00 PM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupPhone">Teléfono de tienda</Label>
                    <Input
                      id="pickupPhone"
                      value={shippingSettings.pickupPhone}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          pickupPhone: e.target.value,
                        })
                      }
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Esta información se mostrará a los clientes en el proceso de checkout para que sepan dónde recoger sus pedidos.
                </p>
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

        {/* Payment Settings */}
        <TabsContent value="payments">
          <div className="space-y-6">
            {/* Yape */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Yape</CardTitle>
                      <CardDescription>
                        Configura tu número de Yape para recibir pagos
                      </CardDescription>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={paymentSettings.yapeEnabled === 'true'}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          yapeEnabled: e.target.checked ? 'true' : 'false',
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </CardHeader>
              {paymentSettings.yapeEnabled === 'true' && (
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="yapePhone">Número de Yape</Label>
                      <Input
                        id="yapePhone"
                        value={paymentSettings.yapePhone}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            yapePhone: e.target.value,
                          })
                        }
                        placeholder="999 999 999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yapeName">Nombre del titular</Label>
                      <Input
                        id="yapeName"
                        value={paymentSettings.yapeName}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            yapeName: e.target.value,
                          })
                        }
                        placeholder="Juan Pérez"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Bank Transfer */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Transferencia Bancaria</CardTitle>
                      <CardDescription>
                        Configura tu cuenta bancaria para recibir transferencias
                      </CardDescription>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={paymentSettings.transferEnabled === 'true'}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          transferEnabled: e.target.checked ? 'true' : 'false',
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </CardHeader>
              {paymentSettings.transferEnabled === 'true' && (
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Banco</Label>
                      <Input
                        id="bankName"
                        value={paymentSettings.bankName}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            bankName: e.target.value,
                          })
                        }
                        placeholder="BCP, Interbank, BBVA..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountHolder">Nombre del titular</Label>
                      <Input
                        id="bankAccountHolder"
                        value={paymentSettings.bankAccountHolder}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            bankAccountHolder: e.target.value,
                          })
                        }
                        placeholder="Juan Pérez"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountNumber">Número de cuenta</Label>
                      <Input
                        id="bankAccountNumber"
                        value={paymentSettings.bankAccountNumber}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            bankAccountNumber: e.target.value,
                          })
                        }
                        placeholder="1234567890123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankCCI">Código CCI</Label>
                      <Input
                        id="bankCCI"
                        value={paymentSettings.bankCCI}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            bankCCI: e.target.value,
                          })
                        }
                        placeholder="00212345678901234567"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* PayPal */}
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wallet className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <CardTitle>PayPal</CardTitle>
                      <CardDescription>
                        Configura tu email de PayPal para recibir pagos internacionales
                      </CardDescription>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={paymentSettings.paypalEnabled === 'true'}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          paypalEnabled: e.target.checked ? 'true' : 'false',
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </CardHeader>
              {paymentSettings.paypalEnabled === 'true' && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">Email de PayPal</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      value={paymentSettings.paypalEmail}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          paypalEmail: e.target.value,
                        })
                      }
                      placeholder="tu-email@paypal.com"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Card Payments */}
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle>Tarjeta de Crédito/Débito</CardTitle>
                      <CardDescription>
                        Pagos con tarjeta (requiere integración con pasarela de pago)
                      </CardDescription>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={paymentSettings.cardEnabled === 'true'}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          cardEnabled: e.target.checked ? 'true' : 'false',
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </CardHeader>
              {paymentSettings.cardEnabled === 'true' && (
                <CardContent className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Nota:</strong> Para habilitar pagos con tarjeta necesitas integrar una pasarela de pago como Stripe, Culqi, MercadoPago o similar. Contacta a tu desarrollador para configurar esta opción.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardProvider">Proveedor de pagos (opcional)</Label>
                    <Input
                      id="cardProvider"
                      value={paymentSettings.cardProvider}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          cardProvider: e.target.value,
                        })
                      }
                      placeholder="Stripe, Culqi, MercadoPago..."
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Cash on Delivery */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Wallet className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle>Pago contra entrega</CardTitle>
                      <CardDescription>
                        Permite a los clientes pagar en efectivo al recibir su pedido
                      </CardDescription>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={paymentSettings.cashEnabled === 'true'}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          cashEnabled: e.target.checked ? 'true' : 'false',
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </CardHeader>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSavePayments} disabled={updateMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                Guardar configuración de pagos
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
