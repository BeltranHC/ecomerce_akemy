'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';

interface ExportButtonsProps {
    stats: any;
    salesData: any[];
    topProducts: any[];
    ordersByStatus: any[];
}

export function ExportButtons({ stats, salesData, topProducts, ordersByStatus }: ExportButtonsProps) {
    const [isExporting, setIsExporting] = useState(false);

    const exportToExcel = async () => {
        setIsExporting(true);
        try {
            const XLSX = await import('xlsx');

            const workbook = XLSX.utils.book_new();

            // Hoja 1: Resumen
            const summaryData = [
                ['Reporte de Dashboard - AKEMY', ''],
                ['Fecha de generación', new Date().toLocaleString('es-PE')],
                ['', ''],
                ['Métricas Generales', ''],
                ['Total Productos', stats?.overview?.totalProducts || 0],
                ['Total Pedidos', stats?.overview?.totalOrders || 0],
                ['Total Clientes', stats?.overview?.totalCustomers || 0],
                ['Pedidos Pendientes', stats?.overview?.pendingOrders || 0],
                ['', ''],
                ['Ventas', ''],
                ['Ventas del día', stats?.sales?.today?.total || 0],
                ['Ventas del mes', stats?.sales?.month?.total || 0],
                ['Ventas del año', stats?.sales?.year?.total || 0],
            ];
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

            // Hoja 2: Ventas por período
            if (salesData && salesData.length > 0) {
                const salesSheetData = [
                    ['Fecha', 'Ventas (S/)'],
                    ...salesData.map((item) => [item.date, item.total]),
                ];
                const salesSheet = XLSX.utils.aoa_to_sheet(salesSheetData);
                XLSX.utils.book_append_sheet(workbook, salesSheet, 'Ventas por Período');
            }

            // Hoja 3: Productos más vendidos
            if (topProducts && topProducts.length > 0) {
                const productsSheetData = [
                    ['#', 'Producto', 'SKU', 'Precio', 'Unidades Vendidas'],
                    ...topProducts.map((product, index) => [
                        index + 1,
                        product.name,
                        product.sku,
                        product.price,
                        product.totalSold,
                    ]),
                ];
                const productsSheet = XLSX.utils.aoa_to_sheet(productsSheetData);
                XLSX.utils.book_append_sheet(workbook, productsSheet, 'Top Productos');
            }

            // Hoja 4: Pedidos por estado
            if (ordersByStatus && ordersByStatus.length > 0) {
                const ordersSheetData = [
                    ['Estado', 'Cantidad'],
                    ...ordersByStatus.map((item) => [item.status, item.count]),
                ];
                const ordersSheet = XLSX.utils.aoa_to_sheet(ordersSheetData);
                XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Pedidos por Estado');
            }

            // Descargar
            const fileName = `dashboard_akemy_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            toast.success('Reporte Excel descargado correctamente');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            toast.error('Error al exportar a Excel');
        } finally {
            setIsExporting(false);
        }
    };

    const exportToPdf = async () => {
        setIsExporting(true);
        try {
            const { default: jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');

            const doc = new jsPDF();

            // Título
            doc.setFontSize(20);
            doc.setTextColor(139, 92, 246); // Purple color
            doc.text('Reporte de Dashboard - AKEMY', 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, 14, 30);

            // Resumen
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('Resumen General', 14, 45);

            autoTable(doc, {
                startY: 50,
                head: [['Métrica', 'Valor']],
                body: [
                    ['Total Productos', String(stats?.overview?.totalProducts || 0)],
                    ['Total Pedidos', String(stats?.overview?.totalOrders || 0)],
                    ['Total Clientes', String(stats?.overview?.totalCustomers || 0)],
                    ['Pedidos Pendientes', String(stats?.overview?.pendingOrders || 0)],
                ],
                theme: 'striped',
                headStyles: { fillColor: [139, 92, 246] },
            });

            // Ventas
            const finalY = (doc as any).lastAutoTable.finalY || 90;
            doc.setFontSize(14);
            doc.text('Ventas', 14, finalY + 15);

            autoTable(doc, {
                startY: finalY + 20,
                head: [['Período', 'Total (S/)']],
                body: [
                    ['Ventas del día', `S/ ${Number(stats?.sales?.today?.total || 0).toFixed(2)}`],
                    ['Ventas del mes', `S/ ${Number(stats?.sales?.month?.total || 0).toFixed(2)}`],
                    ['Ventas del año', `S/ ${Number(stats?.sales?.year?.total || 0).toFixed(2)}`],
                ],
                theme: 'striped',
                headStyles: { fillColor: [139, 92, 246] },
            });

            // Top productos en nueva página
            if (topProducts && topProducts.length > 0) {
                doc.addPage();
                doc.setFontSize(14);
                doc.text('Productos Más Vendidos', 14, 22);

                autoTable(doc, {
                    startY: 27,
                    head: [['#', 'Producto', 'SKU', 'Unidades']],
                    body: topProducts.map((product, index) => [
                        String(index + 1),
                        product.name?.substring(0, 30) || '',
                        product.sku || '',
                        String(product.totalSold || 0),
                    ]),
                    theme: 'striped',
                    headStyles: { fillColor: [139, 92, 246] },
                });
            }

            // Descargar
            const fileName = `dashboard_akemy_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            toast.success('Reporte PDF descargado correctamente');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            toast.error('Error al exportar a PDF');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isExporting}>
                    {isExporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    Exportar
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                    Exportar a Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPdf}>
                    <FileText className="mr-2 h-4 w-4 text-red-600" />
                    Exportar a PDF
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
