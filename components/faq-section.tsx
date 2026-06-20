import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";

const faqs = [
  {
    question: "How quickly can I get my order?",
    answer:
      "We typically deliver within 25–35 minutes in our active zones. Delivery times are displayed clearly for each area so you always know when to expect your meal."
  },
  {
    question: "Are the ingredients really fresh?",
    answer:
      "Yes. We prepare every order from scratch, using fresh vegetables, premium sauces, and carefully selected proteins in our dedicated home kitchen."
  },
  {
    question: "Can I order directly on WhatsApp?",
    answer:
      "Absolutely — our WhatsApp button connects you directly with the kitchen. We confirm every order with a message and answer any special requests instantly."
  },
  {
    question: "What makes your food premium?",
    answer:
      "We focus on clean presentation, balanced seasoning, and restaurant-quality care while keeping the warmth and comfort of a homemade meal."
  },
  {
    question: "Do you have a safe packaging process?",
    answer:
      "Yes. All meals are packed in sealed containers and insulated bags for safe transit, with extra care taken during handoff and delivery."
  }
];

export function FAQSection() {
  return (
    <FadeInSection id="faq" className="bg-[#0F0F0F] py-16 text-white">
      <div className="container-pad">
        <SectionHeader
          eyebrow="FAQ"
          title="Everything you need to know before you order"
          description="Premium food, transparent delivery, and a simple ordering experience — all designed to make your next meal effortless."
          tone="dark"
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-5 transition hover:border-amber-200/40"
            >
              <summary className="cursor-pointer text-base font-semibold text-white">
                {question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-orange-100/90">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
