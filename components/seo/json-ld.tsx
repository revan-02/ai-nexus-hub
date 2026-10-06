import React from 'react';

export function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://ainexus.platform.io/#website',
        url: 'https://ainexus.platform.io',
        name: 'AI Nexus Hub',
        description:
          'Production-grade AI Knowledge, Real-World Full-Stack Expert Challenges, Agriculture AI, Cybersecurity Defense, and VTU Solved Papers.',
        publisher: {
          '@id': 'https://ainexus.platform.io/#organization'
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://ainexus.platform.io/courses?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        ]
      },
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://ainexus.platform.io/#organization',
        name: 'AI Nexus Knowledge Hub & Research Labs',
        url: 'https://ainexus.platform.io',
        logo: {
          '@type': 'ImageObject',
          url: 'https://ainexus.platform.io/robot-3d.png',
          caption: 'AI Nexus Hub Logo'
        },
        sameAs: [
          'https://github.com/ainexus-platform',
          'https://linkedin.com/company/ainexus-platform',
          'https://twitter.com/ainexus_ai',
          'https://facebook.com/ainexus_ai'
        ],
        accreditedBy: {
          '@type': 'Organization',
          name: 'ISO/IEC 17024:2012 & Open Badges 3.0 Credentialing Standard'
        }
      },
      {
        '@type': 'Course',
        name: 'Full-Stack AI Engineering & Real-World Challenges',
        description:
          'Master Data Structures, System Design (HLD/BL), Database Query Optimization, AI Inference Pipelines, and Frontend UI Simulators.',
        provider: {
          '@id': 'https://ainexus.platform.io/#organization'
        },
        educationalCredentialAwarded: {
          '@type': 'EducationalOccupationalCredential',
          name: 'Verified Full-Stack AI Engineer Certification (Open Badges 3.0)',
          credentialCategory: 'Industry Certified Credential'
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: 'PT40H'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://ainexus.platform.io/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Are AI Nexus certificates ISO/IEC 17024 accredited?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, all AI Nexus engineering certificates adhere to ISO/IEC 17024 standards and Open Badges 3.0 with cryptographically verifiable signatures.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can students access VTU solved question papers with calculus proofs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, AI Nexus provides comprehensive solved question papers with step-by-step mathematical proofs and real-time code sandboxes for engineering students.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can courses be shared with referral coupons?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, students can generate personalized referral links with discount coupons (such as NEXUS50, SUPERAI, VTU100) and share directly via WhatsApp, LinkedIn, or Email.'
            }
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://ainexus.platform.io/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://ainexus.platform.io'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Courses & Curriculum',
            item: 'https://ainexus.platform.io/courses'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'AI Model Comparison',
            item: 'https://ainexus.platform.io/model-comparison'
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
