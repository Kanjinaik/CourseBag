import { useState } from 'react';
import { Document, Page, Text, View, Image, StyleSheet, pdf, Font } from '@react-pdf/renderer';

// Register fonts
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
    logoContainer: {
        marginBottom: 10,
    },
    logo: {
        width: 80,
        height: 40,
        objectFit: 'contain',
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
                    {invoiceData.siteLogo && (
                        <View style={styles.logoContainer}>
                            <Image src={invoiceData.siteLogo} style={styles.logo} />
                        </View>
                    )}
                    <Text style={styles.companyName}>{invoiceData.siteName}</Text>
                    <Text>{invoiceData.siteAddress}</Text>
                    {invoiceData.contactInfo?.phone1 && (
                        <Text>Phone: {invoiceData.contactInfo.phone1}</Text>
                    )}
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

export default function InvoiceDownload({ transactionId }) {
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            setError(null);

            // Fetch invoice data - use window.route if available, otherwise construct URL
            let finalUrl;
            if (typeof window !== 'undefined' && window.route) {
                const routeResult = window.route('mytransections.invoice-data', transactionId);
                finalUrl = (routeResult && routeResult !== '#') ? routeResult : `/mytransections/${transactionId}/invoice-data`;
            } else {
                finalUrl = `/mytransections/${transactionId}/invoice-data`;
            }

            console.log('Fetching invoice data from:', finalUrl);

            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', response.status, errorText);
                throw new Error(`Failed to fetch invoice data: ${response.status} ${response.statusText}`);
            }

            const invoiceData = await response.json();
            console.log('Invoice data received:', invoiceData);

            if (!invoiceData || !invoiceData.invoiceNumber) {
                throw new Error('Invalid invoice data received');
            }

            // Generate PDF
            const filename = `Invoice-${invoiceData.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
            console.log('Generating PDF:', filename);

            const doc = <InvoiceDocument invoiceData={invoiceData} />;
            const asPdf = pdf(doc);
            const blob = await asPdf.toBlob();

            console.log('PDF blob generated, size:', blob.size, 'bytes');

            if (!blob || blob.size === 0) {
                throw new Error('Failed to generate PDF blob');
            }

            // Trigger download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);

            console.log('Triggering download...');
            link.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setDownloading(false);
                console.log('Download completed');
            }, 200);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            setError('Failed to download invoice');
            setDownloading(false);
            alert(`Failed to download invoice: ${error.message || 'Please try again.'}`);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={downloading}
            className="text-blue-600 hover:text-blue-900 flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {downloading ? (
                <>
                    <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generating PDF...
                </>
            ) : (
                <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Invoice PDF
                </>
            )}
        </button>
    );
}

