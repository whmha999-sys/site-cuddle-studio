import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Item {
  name?: string
  color?: string
  qty?: number
  price?: number
}

interface Props {
  orderNumber?: string | number
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  items?: Item[]
  subtotal?: number
  shipping?: number
  tax?: number
  discount?: number
  total?: number
  currency?: string
  paymentMethod?: string
  notes?: string
}

const Email = ({
  orderNumber,
  firstName = '',
  lastName = '',
  email = '',
  phone = '',
  address = '',
  city = '',
  items = [],
  subtotal = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  total = 0,
  currency = '',
  paymentMethod = '',
  notes,
}: Props) => {
  const fmt = (n: number) =>
    `${currency ? currency + ' ' : ''}${Number(n || 0).toFixed(2)}`
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New order #{String(orderNumber ?? '')} — {firstName} {lastName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Order Received</Heading>
          <Text style={muted}>Order #{String(orderNumber ?? '—')}</Text>

          <Section style={card}>
            <Heading as="h2" style={h2}>Customer</Heading>
            <Text style={p}><strong>Name:</strong> {firstName} {lastName}</Text>
            <Text style={p}><strong>Email:</strong> {email}</Text>
            <Text style={p}><strong>Phone:</strong> {phone}</Text>
            <Text style={p}><strong>Address:</strong> {address}</Text>
            <Text style={p}><strong>City:</strong> {city}</Text>
          </Section>

          <Section style={card}>
            <Heading as="h2" style={h2}>Items</Heading>
            {items.map((it, i) => (
              <Row key={i} style={{ marginBottom: 8 }}>
                <Column>
                  <Text style={p}>
                    {it.name || '—'}{it.color ? ` — ${it.color}` : ''} × {it.qty ?? 1}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={p}>{fmt((it.price ?? 0) * (it.qty ?? 1))}</Text>
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Row><Column><Text style={p}>Subtotal</Text></Column><Column align="right"><Text style={p}>{fmt(subtotal)}</Text></Column></Row>
            {discount ? <Row><Column><Text style={p}>Discount</Text></Column><Column align="right"><Text style={p}>-{fmt(discount)}</Text></Column></Row> : null}
            {tax ? <Row><Column><Text style={p}>Tax</Text></Column><Column align="right"><Text style={p}>{fmt(tax)}</Text></Column></Row> : null}
            {shipping ? <Row><Column><Text style={p}>Shipping</Text></Column><Column align="right"><Text style={p}>{fmt(shipping)}</Text></Column></Row> : null}
            <Row><Column><Text style={total_}>Total</Text></Column><Column align="right"><Text style={total_}>{fmt(total)}</Text></Column></Row>
          </Section>

          <Section style={card}>
            <Text style={p}><strong>Payment:</strong> {paymentMethod || 'cod'}</Text>
            {notes ? <Text style={p}><strong>Notes:</strong> {notes}</Text> : null}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', padding: '24px 0' }
const container = { maxWidth: 560, margin: '0 auto', padding: '0 24px' }
const h1 = { fontSize: 22, margin: '0 0 4px', color: '#0d0d0d' }
const h2 = { fontSize: 16, margin: '0 0 12px', color: '#0d0d0d' }
const p = { fontSize: 14, margin: '4px 0', color: '#222' }
const muted = { fontSize: 13, color: '#666', margin: '0 0 16px' }
const card = { border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 16 }
const hr = { borderColor: '#eee', margin: '12px 0' }
const total_ = { fontSize: 15, fontWeight: 700 as const, margin: '6px 0', color: '#0d0d0d' }

export const template = {
  component: Email,
  subject: (d: Record<string, unknown>) =>
    `New order #${d.orderNumber ?? ''} — ${d.firstName ?? ''} ${d.lastName ?? ''}`.trim(),
  displayName: 'New order (admin)',
  to: 'whmha999@gmail.com',
  previewData: {
    orderNumber: 1001,
    firstName: 'Ahmed',
    lastName: 'M.',
    email: 'customer@example.com',
    phone: '+213555000000',
    address: 'Rue 1',
    city: 'Algiers',
    items: [{ name: 'Tablet', color: 'Black', qty: 1, price: 299 }],
    subtotal: 299, total: 299, currency: 'DZD', paymentMethod: 'cod',
  },
} satisfies TemplateEntry
