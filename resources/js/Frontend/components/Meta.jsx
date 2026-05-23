import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Meta({ 
    title, 
    description, 
    keywords, 
    image, 
    canonical,
    ...props 
}) {
    const page = usePage();
    const { websiteSettings, seoSettings } = page.props;
    
    // Check if we're on home page
    const url = page?.url && typeof page.url === 'string' ? page.url : (typeof window !== 'undefined' ? window.location.pathname : '/');
    const isHomePage = url === '/' || url === '';
    
    // Get SEO values
    const siteTitle = (seoSettings?.site_title && seoSettings.site_title.trim() !== '') 
        ? seoSettings.site_title 
        : (websiteSettings?.site_name || 'CourseBag');
    const metaTitleValue = (seoSettings?.meta_title && seoSettings.meta_title.trim() !== '') 
        ? seoSettings.meta_title 
        : '';
    
    // For home page: "Meta Title | Site Title" (or just "Site Title")
    // For other pages: "Page Name | Site Title" (when title prop is provided)
    let metaTitle;
    if (isHomePage) {
        // Home page uses Meta Title | Site Title format
        metaTitle = metaTitleValue 
            ? `${metaTitleValue} | ${siteTitle}`
            : siteTitle;
    } else {
        // Other pages: if title provided, format as "Page Name | Site Title"
        // Otherwise don't set title (let pages handle it via Head component)
        metaTitle = (title && title.trim() !== '') 
            ? `${title} | ${siteTitle}`
            : null; // Don't set title for other pages if no title prop
    }
    
    const defaultDescription = (seoSettings?.meta_description && seoSettings.meta_description.trim() !== '') 
        ? seoSettings.meta_description 
        : 'Empowering learners worldwide with quality education';
    const defaultKeywords = seoSettings?.meta_keywords || '';
    const defaultImage = seoSettings?.og_image || seoSettings?.twitter_image || null;
    const defaultCanonical = seoSettings?.canonical_url || '';
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const metaImage = image || defaultImage;
    const metaCanonical = canonical || defaultCanonical || window.location.href;
    
    // Get site URL
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullImageUrl = metaImage ? (metaImage.startsWith('http') ? metaImage : `${siteUrl}/${metaImage}`) : null;
    
    // Open Graph and Twitter Card defaults
    const ogTitle = seoSettings?.og_title || metaTitle;
    const ogDescription = seoSettings?.og_description || metaDescription;
    const ogImage = seoSettings?.og_image ? (seoSettings.og_image.startsWith('http') ? seoSettings.og_image : `${siteUrl}/uploads/seosettings/${seoSettings.og_image}`) : fullImageUrl;
    const ogType = seoSettings?.og_type || 'website';
    const ogSiteName = seoSettings?.og_site_name || websiteSettings?.site_name || 'CourseBag';
    
    const twitterCard = seoSettings?.twitter_card || 'summary_large_image';
    const twitterTitle = seoSettings?.twitter_title || metaTitle;
    const twitterDescription = seoSettings?.twitter_description || metaDescription;
    const twitterImage = seoSettings?.twitter_image ? (seoSettings.twitter_image.startsWith('http') ? seoSettings.twitter_image : `${siteUrl}/uploads/seosettings/${seoSettings.twitter_image}`) : ogImage;
    const twitterSite = seoSettings?.twitter_site || '';
    
    const robots = seoSettings?.robots || 'index, follow';
    const author = seoSettings?.meta_author || '';
    
    // Update favicon dynamically
    useEffect(() => {
        if (websiteSettings?.favicon) {
            // Remove existing favicon links
            const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
            existingLinks.forEach(link => link.remove());
            
            // Add new favicon
            const link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/x-icon';
            link.href = websiteSettings.favicon;
            document.head.appendChild(link);
            
            // Also add shortcut icon for older browsers
            const shortcutLink = document.createElement('link');
            shortcutLink.rel = 'shortcut icon';
            shortcutLink.type = 'image/x-icon';
            shortcutLink.href = websiteSettings.favicon;
            document.head.appendChild(shortcutLink);
        }
    }, [websiteSettings?.favicon]);
    
    return (
        <Head {...(metaTitle ? { title: metaTitle } : {})}>
            {/* Primary Meta Tags */}
            {metaDescription && <meta name="description" content={metaDescription} />}
            {metaKeywords && <meta name="keywords" content={metaKeywords} />}
            {author && <meta name="author" content={author} />}
            <meta name="robots" content={robots} />
            
            {/* Canonical URL */}
            {metaCanonical && <link rel="canonical" href={metaCanonical} />}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={metaCanonical} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {ogSiteName && <meta property="og:site_name" content={ogSiteName} />}
            
            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            {twitterSite && <meta name="twitter:site" content={twitterSite} />}
            <meta name="twitter:title" content={twitterTitle} />
            <meta name="twitter:description" content={twitterDescription} />
            {twitterImage && <meta name="twitter:image" content={twitterImage} />}
            
            {/* Additional Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            
            {/* Schema Markup */}
            {seoSettings?.schema_markup && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seoSettings.schema_markup }} />
            )}
            
            {/* Analytics - Google Analytics */}
            {seoSettings?.google_analytics_id && (
                <>
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${seoSettings.google_analytics_id}`}></script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${seoSettings.google_analytics_id}');
                            `,
                        }}
                    />
                </>
            )}
            
            {/* Google Tag Manager */}
            {seoSettings?.google_tag_manager_id && (
                <>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','${seoSettings.google_tag_manager_id}');
                            `,
                        }}
                    />
                </>
            )}
            
            {/* Facebook Pixel */}
            {seoSettings?.facebook_pixel_id && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${seoSettings.facebook_pixel_id}');
                            fbq('track', 'PageView');
                        `,
                    }}
                />
            )}
            
            {/* Custom Head Code */}
            {seoSettings?.custom_head_code && (
                <div dangerouslySetInnerHTML={{ __html: seoSettings.custom_head_code }} />
            )}
            
            {/* Pass through any additional props */}
            {Object.entries(props).map(([key, value]) => (
                <meta key={key} name={key} content={value} />
            ))}
        </Head>
    );
}

