/**
 * Publishes the GACA drone-surveying guide and the shared blog call to action.
 * Images are Unsplash License photographs (free for commercial use).
 *
 * Run: pnpm exec tsx scripts/publish-gaca-drone-blog.ts
 */
import 'dotenv/config'
import dns from 'node:dns'
import sharp from 'sharp'

// Node's default resolver refuses SRV lookups on some Windows networks. Atlas uses mongodb+srv.
dns.setServers(['1.1.1.1', '8.8.8.8'])
import { getPayload } from 'payload'
import config from '@payload-config'

const SLUG = 'navigating-gaca-regulations-drone-surveying-saudi-arabia'
const AUTHOR = 'Ehsan Ul haq Syed'

const FEATURED_IMAGE = {
  url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80',
  filename: 'gaca-drone-survey-featured.jpg',
  alt: 'White mapping drone with a camera payload flying above a forested survey site',
  credit:
    'Photograph from Unsplash, used under the Unsplash License (free for commercial use, no attribution required). Source: https://images.unsplash.com/photo-1473968512647-3e447244af8f',
  width: 1600,
}

const HERO_IMAGE = {
  url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=2000&q=80',
  filename: 'gaca-drone-survey-banner.jpg',
  alt: 'Golden sand dunes under a bright desert sky, terrain typical of drone surveys in Saudi Arabia',
  credit:
    'Photograph from Unsplash, used under the Unsplash License (free for commercial use, no attribution required). Source: https://images.unsplash.com/photo-1473580044384-7ba9967e16a0',
  width: 1920,
}

const KEYWORDS = [
  'Drone surveying Saudi Arabia',
  'GACA drone permit',
  'aerial mapping KSA',
  'GEOSA survey license',
  'drone no-fly zones Saudi Arabia',
  'GACAR Part 107',
  'Remote Pilot Certificate',
  'Direct Remote ID',
  'مسح جوي بالدرون في السعودية',
  'تصريح طيران درون GACA',
  'ترخيص المساحة الجيومكانية GEOSA',
]

const CTA = {
  badge: 'Work With Us',
  badgeAr: 'اعمل معنا',
  title: 'Plan a Compliant Drone Survey',
  titleAr: 'خطّط لمسح جوي متوافق مع الأنظمة',
  description:
    'Shamal Technologies supports construction, engineering, and mining teams with GACA-aligned aerial mapping, LiDAR, and geospatial data across Saudi Arabia.',
  descriptionAr:
    'تدعم شمل للتقنيات فرق الإنشاءات والهندسة والتعدين بالمسح الجوي وخرائط الليدار والبيانات الجيومكانية المتوافقة مع متطلبات الهيئة العامة للطيران المدني في المملكة العربية السعودية.',
  buttonLabel: 'Talk to Our Team',
  buttonLabelAr: 'تواصل مع فريقنا',
  buttonHref: '/contact',
}

type LexNode = Record<string, unknown>
type Direction = 'ltr' | 'rtl'

function text(value: string, format = 0): LexNode {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text: value,
    version: 1,
  }
}

function paragraph(children: LexNode[] | string, direction: Direction = 'ltr'): LexNode {
  return {
    type: 'paragraph',
    children: typeof children === 'string' ? [text(children)] : children,
    direction,
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function heading(value: string, direction: Direction = 'ltr'): LexNode {
  return {
    type: 'heading',
    children: [text(value)],
    direction,
    format: '',
    indent: 0,
    tag: 'h2',
    version: 1,
  }
}

function link(label: string, url: string, direction: Direction = 'ltr'): LexNode {
  return {
    type: 'link',
    children: [text(label)],
    direction,
    fields: {
      linkType: 'custom',
      newTab: false,
      url,
    },
    format: '',
    indent: 0,
    version: 3,
  }
}

function labeledItem(label: string, body: string, direction: Direction = 'ltr'): LexNode[] {
  return [text(label, 1), text(body)]
}

function bullets(items: LexNode[][], direction: Direction = 'ltr'): LexNode {
  return {
    type: 'list',
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    direction,
    format: '',
    indent: 0,
    version: 1,
    children: items.map((children, index) => ({
      type: 'listitem',
      value: index + 1,
      direction,
      format: '',
      indent: 0,
      version: 1,
      children,
    })),
  }
}

function richText(children: LexNode[], direction: Direction = 'ltr') {
  return {
    root: {
      type: 'root',
      children,
      direction,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function creditCaption(credit: string) {
  return richText([paragraph(credit)])
}

function englishContent() {
  return richText([
    paragraph(
      'The landscape of Saudi Arabia is changing at an unprecedented pace. Driven by Saudi Vision 2030, megaprojects like NEOM, The Red Sea Project, and Qiddiya require rapid, precise, and scalable topographic data. For construction, engineering, and mining firms, drone surveying has become the gold standard for aerial mapping, LiDAR scanning, and volume calculations.',
    ),
    paragraph(
      'However, taking to the skies in the Kingdom isn’t as simple as turning on a drone. Commercial drone operations are heavily regulated to ensure national safety and airspace security.',
    ),
    paragraph(
      'If you are looking to utilize drone data for your next project, understanding the regulatory landscape governed by the General Authority of Civil Aviation (GACA) is critical to keeping your project legal, insured, and on schedule.',
    ),
    heading('1. The Foundation: GACAR Part 107 Compliance'),
    paragraph(
      'Just like commercial airlines, commercial unmanned aircraft systems (UAS) must follow strict civil aviation laws. In Saudi Arabia, this is governed under GACAR Part 107. To operate legally, a drone surveying company must clear three distinct compliance hurdles on the official GACA UAS Portal:',
    ),
    bullets([
      labeledItem(
        'Commercial Institutional Registration: ',
        'The company itself must be registered as a commercial drone operator, linking its commercial registration (CR) to its aviation profile.',
      ),
      labeledItem(
        'The Remote Pilot Certificate (RPC): ',
        'Hobbyist permits are strictly illegal for commercial site surveying. Every drone pilot on a project must hold a valid, GACA-issued Remote Pilot Certificate, which requires passing a rigorous theoretical and practical aviation exam.',
      ),
      labeledItem(
        'Asset Serial Registration: ',
        'Every enterprise drone—whether a DJI Matrice 350 RTK or a fixed-wing mapping drone—must be individually registered with GACA and display an official registration mark.',
      ),
    ]),
    heading('2. Airspace Rules: Knowing Your Limits'),
    paragraph(
      'Even with a licensed company and pilot, drone survey missions must adhere to strict operational envelopes set by GACA to avoid interfering with manned aviation:',
    ),
    bullets([
      labeledItem(
        'The 120-Meter Ceiling: ',
        'Standard drone survey flights are restricted to a maximum altitude of 120 meters (400 feet) above ground level (AGL).',
      ),
      labeledItem(
        'Visual Line of Sight (VLOS): ',
        'The drone must remain within the pilot’s direct, unaided visual line of sight at all times. For massive topographic surveys that require Beyond Visual Line of Sight (BVLOS) operations, special advanced operational authorizations must be secured in advance.',
      ),
      labeledItem(
        'No-Fly Zones: ',
        'Flying near airports, military installations, or restricted government facilities without dedicated, real-time tactical clearance is strictly prohibited.',
      ),
    ]),
    heading('3. The Multi-Agency Framework: GACA vs. GEOSA'),
    paragraph(
      'One of the most common misconceptions in the Saudi market is that a GACA permit is all you need to map a site. In reality, aerial surveying requires a two-step validation process involving two separate government bodies:',
    ),
    bullets([
      labeledItem(
        'GACA (General Authority of Civil Aviation): ',
        'Clears the sky. They grant the permission to fly the drone safely through the airspace.',
      ),
      labeledItem(
        'GEOSA (General Authority for Survey and Geospatial Information): ',
        'Clears the data. Because drone surveying captures precise geographic and spatial data of the Kingdom, the company collecting and processing that data must be licensed by GEOSA.',
      ),
    ]),
    paragraph(
      'Using a vendor that lacks either GACA flight clearance or a GEOSA data license puts your entire project data at risk of confiscation and severe penalties.',
    ),
    heading('4. Direct Remote ID: The Next Regulatory Wave'),
    paragraph(
      'As technology evolves, so do the rules. GACA is actively rolling out Direct Remote ID mandates. This requires enterprise mapping drones to broadcast their real-time telemetry, GPS coordinates, registration numbers, and pilot locations via localized Wi-Fi or Bluetooth signals. Ensuring your drone surveying vendor utilizes up-to-date, compliant hardware guarantees that your site operations won’t face sudden regulatory halts.',
    ),
    heading('Client Checklist: Is Your Drone Survey Vendor Compliant?'),
    paragraph(
      'Before you hire a drone surveying company for your next infrastructure or construction project in Saudi Arabia, protect your investment by asking for proof of the following documents:',
    ),
    bullets([
      [text('Valid GACA Commercial UAS Operator Registration')],
      [text('Active GACA Remote Pilot Certificates (RPC) for all deployed pilots')],
      [text('GACA Registration Stickers/Marks on all drones brought to your site')],
      [text('Valid GEOSA License for aerial photography and geospatial data collection')],
      [text('Approved Flight Permits/Clearances specific to your project coordinates')],
    ]),
    heading('Elevate Your Project, Safely and Legally'),
    paragraph([
      text(
        'Drone surveying drastically reduces data collection times and keeps workers out of dangerous terrain. By partnering with a fully compliant ',
      ),
      link('drone mapping provider', '/services'),
      text(
        ', you ensure that your project reaps the digital benefits of modern aerial intelligence while staying fully compliant with the laws of the Kingdom.',
      ),
    ]),
  ])
}

function arabicContent() {
  const direction: Direction = 'rtl'
  return richText(
    [
      paragraph(
        'يتغير مشهد المملكة العربية السعودية بوتيرة غير مسبوقة. وفي ظل رؤية السعودية 2030، تحتاج المشاريع العملاقة مثل نيوم ومشروع البحر الأحمر والقدية إلى بيانات طبوغرافية سريعة ودقيقة وقابلة للتوسع. وبالنسبة لشركات الإنشاءات والهندسة والتعدين، أصبح المسح الجوي بالطائرات بدون طيار المعيار الذهبي لرسم الخرائط الجوية ومسح الليدار وحساب الكميات.',
        direction,
      ),
      paragraph(
        'لكن التحليق في سماء المملكة ليس ببساطة تشغيل طائرة بدون طيار. فالعمليات التجارية خاضعة لتنظيم صارم يضمن سلامة الأجواء وأمن المجال الجوي الوطني.',
        direction,
      ),
      paragraph(
        'إذا كنت تخطط لاستخدام بيانات الدرون في مشروعك القادم، فإن فهم الإطار التنظيمي الذي تشرف عليه الهيئة العامة للطيران المدني (GACA) ضروري لإبقاء المشروع نظاميًا ومؤمّنًا وفي موعده.',
        direction,
      ),
      heading('1. الأساس: الامتثال للجزء 107 من لوائح GACAR', direction),
      paragraph(
        'مثل شركات الطيران التجارية، يجب أن تلتزم أنظمة الطائرات بدون طيار التجارية بقوانين الطيران المدني. وفي السعودية يخضع ذلك للجزء 107 من لوائح الطيران المدني (GACAR Part 107). ولكي تعمل شركة المسح الجوي بشكل نظامي، عليها اجتياز ثلاثة متطلبات عبر بوابة الطائرات بدون طيار الرسمية لدى الهيئة:',
        direction,
      ),
      bullets(
        [
          labeledItem(
            'التسجيل المؤسسي التجاري: ',
            'يجب تسجيل الشركة نفسها كمشغّل تجاري للطائرات بدون طيار، وربط سجلها التجاري بملفها في الطيران المدني.',
            direction,
          ),
          labeledItem(
            'شهادة الطيار عن بُعد (RPC): ',
            'تصاريح الهواة غير نظامية لمسح المواقع التجاري. ويجب أن يحمل كل طيار في المشروع شهادة طيار عن بُعد سارية صادرة عن الهيئة، بعد اجتياز اختبار نظري وعملي صارم.',
            direction,
          ),
          labeledItem(
            'تسجيل الرقم التسلسلي للأصل: ',
            'يجب تسجيل كل طائرة مؤسسية على حدة لدى الهيئة، سواء كانت DJI Matrice 350 RTK أو طائرة مسح ثابتة الجناح، وأن تحمل علامة التسجيل الرسمية.',
            direction,
          ),
        ],
        direction,
      ),
      heading('2. قواعد المجال الجوي: اعرف حدودك', direction),
      paragraph(
        'حتى مع ترخيص الشركة والطيار، يجب أن تلتزم مهمات المسح الجوي بنطاق تشغيلي صارم تضعه الهيئة حتى لا تتعارض مع الطيران المأهول:',
        direction,
      ),
      bullets(
        [
          labeledItem(
            'سقف 120 مترًا: ',
            'تقتصر رحلات المسح الاعتيادية على ارتفاع أقصاه 120 مترًا (400 قدم) فوق مستوى سطح الأرض.',
            direction,
          ),
          labeledItem(
            'خط النظر البصري (VLOS): ',
            'يجب أن تبقى الطائرة ضمن خط النظر البصري المباشر للطيار من دون أجهزة مساعدة. أما المسوح الطبوغرافية الواسعة التي تتطلب الطيران خارج خط النظر (BVLOS) فتحتاج إلى تصاريح تشغيل متقدمة تُستخرج مسبقًا.',
            direction,
          ),
          labeledItem(
            'مناطق حظر الطيران: ',
            'يُحظر الطيران قرب المطارات أو المنشآت العسكرية أو المواقع الحكومية المقيدة من دون تصريح تكتيكي مخصص وفي الوقت الفعلي.',
            direction,
          ),
        ],
        direction,
      ),
      heading('3. الإطار متعدد الجهات: الهيئة العامة للطيران المدني مقابل الهيئة العامة للمساحة', direction),
      paragraph(
        'من أكثر المفاهيم الخاطئة شيوعًا في السوق السعودي أن تصريح الهيئة العامة للطيران المدني يكفي وحده لرسم خريطة الموقع. في الواقع يحتاج المسح الجوي إلى تحقق من جهتين حكوميتين منفصلتين:',
        direction,
      ),
      bullets(
        [
          labeledItem(
            'الهيئة العامة للطيران المدني (GACA): ',
            'تُخلي السماء. وهي التي تمنح الإذن بتحليق الطائرة بأمان داخل المجال الجوي.',
            direction,
          ),
          labeledItem(
            'الهيئة العامة للمساحة والمعلومات الجيومكانية (GEOSA): ',
            'تُخلي البيانات. ولأن المسح الجوي يلتقط بيانات جغرافية ومكانية دقيقة للمملكة، يجب أن تكون الشركة التي تجمع هذه البيانات وتعالجها مرخّصة من الهيئة.',
            direction,
          ),
        ],
        direction,
      ),
      paragraph(
        'والاعتماد على مورّد لا يملك تصريح طيران من الهيئة العامة للطيران المدني أو ترخيص بيانات من الهيئة العامة للمساحة يعرّض بيانات المشروع بأكملها لخطر المصادرة والعقوبات المشددة.',
        direction,
      ),
      heading('4. الهوية عن بُعد المباشرة: الموجة التنظيمية التالية', direction),
      paragraph(
        'مع تطور التقنية تتطور القواعد. وتعمل الهيئة العامة للطيران المدني على تطبيق متطلبات الهوية عن بُعد المباشرة (Direct Remote ID). ويقتضي ذلك أن تبث طائرات المسح المؤسسية، لحظة بلحظة، بيانات الطيران وإحداثيات GPS وأرقام التسجيل وموقع الطيار عبر إشارات واي فاي أو بلوتوث محلية. واختيار مورّد يستخدم أجهزة محدّثة ومتوافقة يحمي عمليات الموقع من التوقف المفاجئ لأسباب تنظيمية.',
        direction,
      ),
      heading('قائمة تحقق للعميل: هل مورّد المسح الجوي لديك ملتزم؟', direction),
      paragraph(
        'قبل التعاقد مع شركة مسح جوي لمشروع بنية تحتية أو إنشاءات في السعودية، احمِ استثمارك بطلب إثبات الوثائق التالية:',
        direction,
      ),
      bullets(
        [
          [text('تسجيل ساري كمشغّل تجاري للطائرات بدون طيار لدى الهيئة العامة للطيران المدني')],
          [text('شهادات طيار عن بُعد (RPC) سارية لجميع الطيارين العاملين في الموقع')],
          [text('ملصقات أو علامات تسجيل صادرة عن الهيئة على جميع الطائرات التي تصل إلى موقعك')],
          [text('ترخيص ساري من الهيئة العامة للمساحة للتصوير الجوي وجمع البيانات الجيومكانية')],
          [text('تصاريح أو إفراجات طيران معتمدة خاصة بإحداثيات مشروعك')],
        ],
        direction,
      ),
      heading('ارتقِ بمشروعك بأمان وضمن النظام', direction),
      paragraph(
        [
          text(
            'يختصر المسح الجوي زمن جمع البيانات ويبقي العاملين بعيدًا عن التضاريس الخطرة. وبالشراكة مع ',
          ),
          link('مزوّد خرائط جوية ملتزم', '/services', direction),
          text('، يحصل مشروعك على فوائد الذكاء الجوي الحديث مع الالتزام الكامل بأنظمة المملكة.'),
        ],
        direction,
      ),
    ],
    direction,
  )
}

async function fetchImage(url: string) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'ShamalTechnologiesBlog/1.0' },
  })
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`)
  }
  return Buffer.from(await response.arrayBuffer())
}

async function uploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  image: typeof FEATURED_IMAGE,
) {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { alt: { equals: image.alt } },
  })
  if (existing.docs[0]) return existing.docs[0]

  const source = await fetchImage(image.url)
  const data = await sharp(source)
    .rotate()
    .resize({ width: image.width, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()

  return payload.create({
    collection: 'media',
    overrideAccess: true,
    data: {
      alt: image.alt,
      caption: creditCaption(image.credit),
    },
    file: {
      data,
      mimetype: 'image/jpeg',
      name: image.filename,
      size: data.length,
    },
  })
}

async function publish() {
  const payload = await getPayload({ config })
  const publishedAt = new Date().toISOString()

  payload.logger.info('Uploading freely licensed blog images…')
  const [featuredImage, heroImage] = await Promise.all([
    uploadImage(payload, FEATURED_IMAGE),
    uploadImage(payload, HERO_IMAGE),
  ])

  const data = {
    title: 'Navigating GACA Regulations: The Essential Guide for Drone Surveying in Saudi Arabia',
    titleAr:
      'التنقل في لوائح الهيئة العامة للطيران المدني: الدليل الأساسي للمسح الجوي بالطائرات بدون طيار في السعودية',
    slug: SLUG,
    generateSlug: false,
    author: AUTHOR,
    date: publishedAt,
    publishedAt,
    _status: 'published' as const,
    category: 'industry-insights' as const,
    tags: KEYWORDS,
    description:
      'Commercial drone surveying in Saudi Arabia depends on GACA Part 107, remote pilot certificates, aircraft registration, flight clearances, and a GEOSA geospatial license.',
    descriptionAr:
      'تخطّط لمسح جوي في المملكة؟ تعرّف كيف تؤثر لوائح GACA الجزء 107 وتصاريح الطيران وترخيص GEOSA على رسم الخرائط الجوية لمشاريع رؤية 2030.',
    featuredImage: featuredImage.id,
    heroImage: heroImage.id,
    content: englishContent(),
    contentAr: arabicContent(),
    meta: {
      title: 'Guide to GACA Drone Regulations for Surveying in Saudi Arabia',
      description:
        'Planning a drone survey in KSA? Learn how GACA Part 107, flight clearances, and GEOSA licensing impact aerial mapping for Vision 2030 megaprojects.',
      image: featuredImage.id,
    },
  }

  const existing = await payload.find({
    collection: 'posts',
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: SLUG } },
  })

  const post = existing.docs[0]
    ? await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        depth: 0,
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          ...data,
          date: existing.docs[0].date || publishedAt,
          publishedAt: existing.docs[0].publishedAt || publishedAt,
        },
      })
    : await payload.create({
        collection: 'posts',
        depth: 0,
        overrideAccess: true,
        draft: false,
        context: { disableRevalidate: true },
        data,
      })

  const postsPage = await payload.findGlobal({
    slug: 'posts-page-content',
    depth: 0,
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'posts-page-content',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      hero: postsPage.hero,
      seo: postsPage.seo,
      cta: CTA,
    },
  })

  payload.logger.info(`Published /posts/${post.slug} by ${AUTHOR} at ${post.publishedAt || post.date}`)
  process.exit(0)
}

publish().catch((error) => {
  console.error(error)
  process.exit(1)
})
