import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Register fonts if needed
Font.register({
    family: 'Roboto',
    src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf',
});

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Roboto',
    },
    header: {
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '2px solid #10b981',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    companyInfo: {
        flex: 1,
    },
    companyName: {
        fontSize: 20,
        color: '#10b981',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    invoiceInfo: {
        flex: 1,
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 18,
        color: '#10b981',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    billingSection: {
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    billingBox: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 12,
        color: '#10b981',
        marginBottom: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    table: {
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#10b981',
        color: 'white',
        padding: 10,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #ddd',
        padding: 10,
    },
    tableCell: {
        flex: 1,
    },
    tableCellRight: {
        flex: 1,
        textAlign: 'right',
    },
    totalSection: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    totalBox: {
        width: 250,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
        borderBottom: '1px solid #ddd',
    },
    grandTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#10b981',
        borderTop: '2px solid #10b981',
        borderBottom: '2px solid #10b981',
        padding: 10,
        marginTop: 5,
    },
    footer: {
        marginTop: 40,
        paddingTop: 20,
        borderTop: '1px solid #ddd',
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
    },
});

// Invoice Document Component
const InvoiceDocument = ({ invoiceData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{invoiceData.siteName}</Text>
                    <Text>{invoiceData.siteAddress}</Text>
                    <Text>Email: {invoiceData.siteEmail}</Text>
                </View>
                <View style={styles.invoiceInfo}>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <Text>Invoice #: {invoiceData.invoiceNumber}</Text>
                    <Text>Date: {invoiceData.invoiceDate}</Text>
                    <Text>Order ID: {invoiceData.transaction.payment_gateway === 'pinelabs' ? invoiceData.transaction.pinelabs_order_id : invoiceData.transaction.razorpay_order_id}</Text>
                    <Text>Payment ID: {invoiceData.transaction.payment_gateway === 'pinelabs' ? invoiceData.transaction.pinelabs_payment_id : invoiceData.transaction.razorpay_payment_id}</Text>
                    <Text>Gateway: {(invoiceData.transaction.payment_gateway || 'razorpay').toUpperCase()}</Text>
                </View>
            </View>

            {/* Billing Info */}
            <View style={styles.billingSection}>
                <View style={styles.billingBox}>
                    <Text style={styles.sectionTitle}>Bill To:</Text>
                    <Text style={{ fontWeight: 'bold' }}>{invoiceData.user.name}</Text>
                    <Text>{invoiceData.user.email}</Text>
                </View>
                <View style={styles.billingBox}>
                    <Text style={styles.sectionTitle}>Payment Status:</Text>
                    <Text style={{ backgroundColor: '#10b981', color: 'white', padding: '4px 12px', borderRadius: 4, fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', width: 80, marginBottom: 8 }}>
                        {invoiceData.transaction.status.toUpperCase()}
                    </Text>
                    <Text style={{ marginTop: 8 }}>Payment Date: {invoiceData.transaction.created_at_full}</Text>
                </View>
            </View>

            {/* Courses Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, { color: 'white' }]}>#</Text>
                    <Text style={[styles.tableCell, { color: 'white' }]}>Course Name</Text>
                    <Text style={[styles.tableCell, { color: 'white' }]}>Category</Text>
                    <Text style={[styles.tableCellRight, { color: 'white' }]}>Price</Text>
                </View>
                {invoiceData.courses.map((course, index) => (
                    <View key={course.id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{course.title}</Text>
                        <Text style={styles.tableCell}>{course.category}</Text>
                        <Text style={styles.tableCellRight}>₹{course.price.toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            {/* Total Section */}
            <View style={styles.totalSection}>
                <View style={styles.totalBox}>
                    <View style={styles.totalRow}>
                        <Text>Subtotal:</Text>
                        <Text>₹{invoiceData.transaction.amount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text>Tax (GST):</Text>
                        <Text>₹0.00</Text>
                    </View>
                    <View style={[styles.totalRow, styles.grandTotal]}>
                        <Text>Total Amount:</Text>
                        <Text>₹{invoiceData.transaction.amount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text>Currency:</Text>
                        <Text>{invoiceData.transaction.currency.toUpperCase()}</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for your purchase!</Text>
                <Text style={{ marginTop: 5 }}>This is a computer-generated invoice and does not require a signature.</Text>
                <Text style={{ marginTop: 5 }}>For any queries, please contact us at {invoiceData.siteEmail}</Text>
            </View>
        </Page>
    </Document>
);

export default function Invoice({ transactionId }) {
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(route('mytransections.invoice-data', transactionId))
            .then(res => res.json())
            .then(data => {
                setInvoiceData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching invoice data:', error);
                setLoading(false);
            });
    }, [transactionId]);

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Invoice" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading invoice data...</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!invoiceData) {
        return (
            <AuthenticatedLayout>
                <Head title="Invoice Error" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
                        <p className="text-red-600">Failed to load invoice data.</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const filename = `Invoice-${invoiceData.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;

    return (
        <AuthenticatedLayout>
            <Head title="Invoice" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Ready</h2>
                            <PDFDownloadLink
                                document={<InvoiceDocument invoiceData={invoiceData} />}
                                fileName={filename}
                                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                            >
                                {({ blob, url, loading: pdfLoading }) =>
                                    pdfLoading ? 'Generating PDF...' : 'Download Invoice PDF'
                                }
                            </PDFDownloadLink>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

