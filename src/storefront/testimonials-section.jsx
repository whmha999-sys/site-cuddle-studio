import React from 'react';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

export function TestimonialsSection({ lang = 'en' }) {
  const ar = lang === 'ar';

  const testimonials = ar
    ? [
        {
          id: 1,
          name: 'أحمد العمري',
          role: 'مهندس برمجيات',
          company: 'عمّان',
          content:
            'جودة المنتجات ممتازة والتوصيل كان أسرع من المتوقع. الساعة الذكية تعمل بكفاءة عالية وتدعم اللغة العربية بشكل كامل. أنصح فيها بشدة!',
          rating: 5,
        },
        {
          id: 2,
          name: 'فاطمة الحسن',
          role: 'صاحبة عمل',
          company: 'دمشق',
          content:
            'خدمة العملاء راقية جداً وردّوا عليّ خلال دقائق. التابلت ممتاز للعمل والدراسة، والسعر منافس مقارنة بالمتاجر الأخرى.',
          rating: 5,
        },
        {
          id: 3,
          name: 'خالد العبيدي',
          role: 'مصور فوتوغرافي',
          company: 'بغداد',
          content:
            'تجربة شراء مميزة من البداية للنهاية. وصلني الطلب مغلفاً بعناية وبحالة ممتازة. سأعود للشراء مرة أخرى بكل تأكيد.',
          rating: 5,
        },
        {
          id: 4,
          name: 'نور الرشدان',
          role: 'طالبة جامعية',
          company: 'إربد',
          content:
            'أفضل متجر إلكترونيات تعاملت معه. الأسعار مناسبة جداً والمنتجات أصلية ١٠٠٪. التوصيل لإربد كان سريع وبدون أي مشاكل.',
          rating: 5,
        },
      ]
    : [
        {
          id: 1,
          name: 'Ahmed Al-Omari',
          role: 'Software Engineer',
          company: 'Amman',
          content:
            'Excellent product quality and delivery was faster than expected. The smartwatch works perfectly and fully supports Arabic. Highly recommended!',
          rating: 5,
        },
        {
          id: 2,
          name: 'Fatima Al-Hassan',
          role: 'Business Owner',
          company: 'Damascus',
          content:
            'Customer service is top-notch — they replied within minutes. The tablet is great for work and study, and the price beats other shops.',
          rating: 5,
        },
        {
          id: 3,
          name: 'Khalid Al-Obaidi',
          role: 'Photographer',
          company: 'Baghdad',
          content:
            'A premium buying experience from start to finish. My order arrived carefully packed and in perfect condition. I will definitely shop again.',
          rating: 5,
        },
        {
          id: 4,
          name: 'Nour Al-Rashdan',
          role: 'University Student',
          company: 'Irbid',
          content:
            'The best electronics store I have dealt with. Prices are very fair, products are 100% authentic, and shipping to Irbid was fast and smooth.',
          rating: 5,
        },
      ];

  return (
    <AnimatedTestimonials
      dir={ar ? 'rtl' : 'ltr'}
      badgeText={ar ? 'يثق بنا عملاؤنا' : 'Trusted by our customers'}
      title={ar ? 'ماذا يقول عملاؤنا' : 'What our customers say'}
      subtitle={
        ar
          ? 'آلاف العملاء في الأردن، السعودية، الإمارات، لبنان وكل الشرق الأوسط يثقون بنا لأجهزتهم الذكية.'
          : 'Thousands of customers across Jordan, Saudi Arabia, the UAE, Lebanon and the wider Middle East trust us for their smart devices.'
      }
      testimonials={testimonials}
      trustedCompaniesTitle={
        ar ? 'نشحن إلى جميع أنحاء الشرق الأوسط' : 'We ship across the Middle East'
      }
      trustedCompanies={
        ar
          ? ['الأردن', 'السعودية', 'الإمارات', 'قطر', 'الكويت', 'لبنان', 'مصر']
          : ['Jordan', 'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Lebanon', 'Egypt']
      }
    />
  );
}

export default TestimonialsSection;
