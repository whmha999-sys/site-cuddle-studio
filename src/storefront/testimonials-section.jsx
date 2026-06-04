import React from 'react';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

export function TestimonialsSection({ lang = 'en' }) {
  const ar = lang === 'ar';

  const testimonials = ar
    ? [
        {
          id: 1,
          name: 'أحمد العتيبي',
          role: 'مهندس برمجيات',
          company: 'الرياض',
          content:
            'جودة المنتجات ممتازة والتوصيل كان أسرع من المتوقع. الساعة الذكية تعمل بكفاءة عالية وتدعم اللغة العربية بشكل كامل. أنصح فيها بشدة!',
          rating: 5,
        },
        {
          id: 2,
          name: 'فاطمة الزعبي',
          role: 'صاحبة عمل',
          company: 'عمّان',
          content:
            'خدمة العملاء راقية جداً وردّوا عليّ خلال دقائق. التابلت ممتاز للعمل والدراسة، والسعر منافس مقارنة بالمتاجر الأخرى في الأردن.',
          rating: 5,
        },
        {
          id: 3,
          name: 'خالد المنصوري',
          role: 'مصور فوتوغرافي',
          company: 'دبي',
          content:
            'تجربة شراء مميزة من البداية للنهاية. وصلني الطلب مغلفاً بعناية وبحالة ممتازة. سأعود للشراء مرة أخرى بكل تأكيد.',
          rating: 5,
        },
        {
          id: 4,
          name: 'نور الحسيني',
          role: 'طالبة جامعية',
          company: 'بيروت',
          content:
            'أفضل متجر إلكترونيات تعاملت معه. الأسعار مناسبة جداً والمنتجات أصلية ١٠٠٪. التوصيل لبيروت كان سريع وبدون أي مشاكل.',
          rating: 5,
        },
      ]
    : [
        {
          id: 1,
          name: 'Ahmed Al-Otaibi',
          role: 'Software Engineer',
          company: 'Riyadh',
          content:
            'Excellent product quality and delivery was faster than expected. The smartwatch works perfectly and fully supports Arabic. Highly recommended!',
          rating: 5,
        },
        {
          id: 2,
          name: 'Fatima Al-Zoubi',
          role: 'Business Owner',
          company: 'Amman',
          content:
            'Customer service is top-notch — they replied within minutes. The tablet is great for work and study, and the price beats other shops in Jordan.',
          rating: 5,
        },
        {
          id: 3,
          name: 'Khalid Al-Mansoori',
          role: 'Photographer',
          company: 'Dubai',
          content:
            'A premium buying experience from start to finish. My order arrived carefully packed and in perfect condition. I will definitely shop again.',
          rating: 5,
        },
        {
          id: 4,
          name: 'Nour Al-Husseini',
          role: 'University Student',
          company: 'Beirut',
          content:
            'The best electronics store I have dealt with. Prices are very fair, products are 100% authentic, and shipping to Beirut was fast and smooth.',
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
