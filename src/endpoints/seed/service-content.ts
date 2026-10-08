import { lexicalText } from './lexical-text'

type Card = {
  title: string
  titleAr: string
  description: string
  descriptionAr: string
}

type Tech = {
  name: string
  nameAr: string
  description: string
  descriptionAr: string
}

type Faq = {
  question: string
  questionAr: string
  answer: string
  answerAr: string
}

export type ServiceContent = {
  /** Corrects a display title without changing the public URL. */
  title?: string
  titleAr?: string
  heroTitle: string
  heroTitleAr: string
  heroDescription: string
  heroDescriptionAr: string
  overviewTitle: string
  overviewTitleAr: string
  overview: string
  overviewAr: string
  benefits: Card[]
  applications: Card[]
  technologies: Tech[]
  faqs: Faq[]
  ctaTitle: string
  ctaTitleAr: string
  ctaDescription: string
  ctaDescriptionAr: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

const ctaButton = {
  ctaButtonText: 'Contact Us',
  ctaButtonTextAr: 'تواصل معنا',
}

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  'aerial-survey': {
    heroTitle: 'Decision-ready maps from the air',
    heroTitleAr: 'خرائط جاهزة للقرار من الجو',
    heroDescription:
      'High-accuracy aerial mapping for terrain, corridors, and development sites — orthophotos, elevation models, contours, and GIS-ready survey outputs across Saudi Arabia.',
    heroDescriptionAr:
      'مسح جوي عالي الدقة للتضاريس والممرات ومواقع التطوير: صور جوية مصححة، ونماذج ارتفاعات، وخطوط كنتور، ومخرجات مساحية جاهزة لنظم المعلومات الجغرافية في أنحاء المملكة.',
    overviewTitle: 'Survey control, not just a flight',
    overviewTitleAr: 'ضبط مساحي، لا مجرد طلعة جوية',
    overview:
      'Shamal plans the mission around the accuracy, the coordinate system, and the file formats your engineers will actually use. Fixed-wing aircraft cover long corridors and wide sites. Multirotor aircraft add detail where the terrain or the asset needs a closer pass.\n\nA typical delivery includes a georeferenced orthophoto, a digital elevation model, contours, and a textured 3D mesh — processed, checked, and handed over as a GIS-ready package rather than a folder of raw images.',
    overviewAr:
      'تخطط شمل المهمة وفق الدقة المطلوبة ونظام الإحداثيات وصيغ الملفات التي سيستخدمها المهندسون فعلياً. تغطي الطائرات ثابتة الجناح الممرات الطويلة والمواقع الواسعة، وتضيف الطائرات متعددة المراوح التفاصيل حيث تحتاج التضاريس أو الأصل إلى مرور أقرب.\n\nيشمل التسليم المعتاد صورة جوية مصححة جغرافياً، ونموذج ارتفاع رقمي، وخطوط كنتور، ومجسم ثلاثي الأبعاد بنسيج واقعي — بعد المعالجة والفحص، كحزمة جاهزة لنظم المعلومات الجغرافية لا كمجلد صور خام.',
    benefits: [
      {
        title: 'Engineering-grade baselines',
        titleAr: 'خطوط أساس بمعايير هندسية',
        description:
          'Orthophotos, elevation models, and contours referenced for design, earthworks, and master planning.',
        descriptionAr:
          'صور مصححة ونماذج ارتفاعات وخطوط كنتور مرجعية للتصميم وأعمال الحفر والتخطيط العمراني.',
      },
      {
        title: 'Built for distance and area',
        titleAr: 'مناسبة للمسافات والمساحات',
        description:
          'Fixed-wing coverage for corridors and large sites, with multirotor detail where a hover is required.',
        descriptionAr:
          'تغطية ثابتة الجناح للممرات والمواقع الكبيرة، مع تفاصيل متعددة المراوح حيث يلزم التحليق الثابت.',
      },
      {
        title: 'Difficult ground, fewer people on it',
        titleAr: 'أرض صعبة ووجود بشري أقل',
        description:
          'Steep ridges, dunes, and unstable rock surveyed from planned flight lines instead of repeated foot access.',
        descriptionAr:
          'مسح الحواف الشديدة والكثبان والصخور غير المستقرة عبر خطوط طيران مخططة بدلاً من الدخول المتكرر سيراً.',
      },
      {
        title: 'Repeatable missions',
        titleAr: 'مهام قابلة للتكرار',
        description:
          'The same control, flight lines, and processing path so a later flight can be compared with the baseline.',
        descriptionAr:
          'نفس الضبط وخطوط الطيران ومسار المعالجة حتى تُقارن الطلعة اللاحقة بخط الأساس.',
      },
      {
        title: 'Checked before handover',
        titleAr: 'فحص قبل التسليم',
        description:
          'Completeness, georeferencing, and documentation reviewed before the package reaches your GIS or design team.',
        descriptionAr:
          'مراجعة الاكتمال والإسناد الجغرافي والتوثيق قبل وصول الحزمة إلى فريق نظم المعلومات أو التصميم.',
      },
      {
        title: 'One chain, from brief to files',
        titleAr: 'سلسلة واحدة من الطلب إلى الملفات',
        description:
          'Requirement, permits, capture, processing, and a technical report delivered as a single scope.',
        descriptionAr:
          'تحديد المتطلب والتصاريح والالتقاط والمعالجة والتقرير الفني ضمن نطاق واحد.',
      },
    ],
    applications: [
      {
        title: 'Master planning and giga-project sites',
        titleAr: 'التخطيط الشامل ومواقع المشاريع الكبرى',
        description:
          'Site-wide orthophotos and terrain models where satellite elevation is too coarse for earthworks and layout.',
        descriptionAr:
          'صور مصححة ونماذج تضاريس على مستوى الموقع حين لا تكفي ارتفاعات الأقمار لأعمال الحفر والمخطط.',
      },
      {
        title: 'Corridors and linear infrastructure',
        titleAr: 'الممرات والبنية الخطية',
        description:
          'Roads, utilities, and pipeline alignments mapped efficiently over distance with consistent ground resolution.',
        descriptionAr:
          'رسم الطرق والمرافق ومسارات الأنابيب بكفاءة على المسافات الطويلة وبدقة أرضية متسقة.',
      },
      {
        title: 'Topographic mapping',
        titleAr: 'الخرائط الطبوغرافية',
        description:
          'Contours, digital surface and terrain models, and textured meshes for engineering and quantity context.',
        descriptionAr:
          'خطوط كنتور ونماذج سطح وتضاريس ومجسمات ذات نسيج للسياق الهندسي والكميات.',
      },
      {
        title: 'Pre-construction baselines',
        titleAr: 'خطوط أساس ما قبل الإنشاء',
        description:
          'A controlled record of the site before work starts, ready for progress comparison later.',
        descriptionAr:
          'سجل منضبط للموقع قبل بدء العمل، جاهز لمقارنة التقدم لاحقاً.',
      },
      {
        title: 'Remote and rugged terrain',
        titleAr: 'التضاريس النائية والوعرة',
        description:
          'Sandstone ridges, dunes, and large elevation change covered without putting crews on unstable ground.',
        descriptionAr:
          'تغطية الحواف الرملية والكثبان وفروق الارتفاع الكبيرة دون وضع الفرق على أرض غير مستقرة.',
      },
      {
        title: 'Real estate and land development',
        titleAr: 'العقار والتطوير العقاري',
        description:
          'Current site condition for planning, marketing context, and coordination with design consultants.',
        descriptionAr:
          'وضع الموقع الحالي للتخطيط وسياق العرض والتنسيق مع استشاريي التصميم.',
      },
    ],
    technologies: [
      {
        name: 'RTK UAV photogrammetry',
        nameAr: 'المسح التصويري بنظام RTK',
        description: 'Automated grid flights with survey-grade positioning and controlled ground resolution.',
        descriptionAr: 'طلعات شبكية آلية بتموضع مساحي ودقة أرضية مضبوطة.',
      },
      {
        name: 'Fixed-wing platforms',
        nameAr: 'منصات ثابتة الجناح',
        description: 'Efficient coverage for long corridors, wide sites, and repeat monitoring programmes.',
        descriptionAr: 'تغطية كفؤة للممرات الطويلة والمواقع الواسعة وبرامج المراقبة المتكررة.',
      },
      {
        name: 'Orthomosaic processing',
        nameAr: 'معالجة الصور المصححة',
        description: 'Georeferenced image basemaps your GIS team can measure and overlay.',
        descriptionAr: 'خرائط صور مسندة جغرافياً يستطيع فريق نظم المعلومات قياسها وتركيبها.',
      },
      {
        name: 'DSM, DTM, and contours',
        nameAr: 'نماذج السطح والتضاريس والكنتور',
        description: 'Elevation products for earthworks, drainage, and route analysis.',
        descriptionAr: 'منتجات ارتفاعات لأعمال الحفر والتصريف وتحليل المسارات.',
      },
      {
        name: 'Textured 3D mesh',
        nameAr: 'مجسم ثلاثي الأبعاد بنسيج',
        description: 'A visual terrain model for stakeholders who need to see the site, not only the contours.',
        descriptionAr: 'نموذج تضاريس بصري لأصحاب المصلحة الذين يحتاجون رؤية الموقع لا خطوط الكنتور فقط.',
      },
      {
        name: 'GIS-ready delivery',
        nameAr: 'تسليم جاهز لنظم المعلومات',
        description: 'Layers, reports, and coordinate documentation prepared for downstream design systems.',
        descriptionAr: 'طبقات وتقارير وتوثيق إحداثيات مهيأة لأنظمة التصميم اللاحقة.',
      },
    ],
    faqs: [
      {
        question: 'What does an aerial survey from Shamal include?',
        questionAr: 'ماذا يشمل المسح الجوي من شمل؟',
        answer:
          'A defined area, accuracy, and deliverable format, followed by flight planning, capture, processing, and a package that typically includes an orthophoto, elevation model, contours, and a technical report.',
        answerAr:
          'تحديد المساحة والدقة وصيغة المخرجات، ثم تخطيط الطيران والالتقاط والمعالجة، وحزمة تشمل عادة صورة مصححة ونموذج ارتفاعات وخطوط كنتور وتقريراً فنياً.',
      },
      {
        question: 'When do you use fixed-wing aircraft instead of a multirotor?',
        questionAr: 'متى تستخدمون الطائرات ثابتة الجناح بدلاً من متعددة المراوح؟',
        answer:
          'Fixed-wing is the better fit for distance, large area, and repeat coverage. Multirotor aircraft are used where the work needs a hover, a close pass, or a smaller site.',
        answerAr:
          'ثابتة الجناح أنسب للمسافة والمساحة الكبيرة والتغطية المتكررة. وتُستخدم متعددة المراوح حين يحتاج العمل تحليقاً ثابتاً أو مروراً قريباً أو موقعاً أصغر.',
      },
      {
        question: 'Can the outputs go straight into our GIS?',
        questionAr: 'هل يمكن إدخال المخرجات مباشرة إلى نظام المعلومات الجغرافية لدينا؟',
        answer:
          'Yes. Deliverables are georeferenced and issued as GIS-ready files, with the coordinate system and methodology documented in the report.',
        answerAr:
          'نعم. تُسلَّم المخرجات مسندة جغرافياً كملفات جاهزة لنظم المعلومات، مع توثيق نظام الإحداثيات والمنهجية في التقرير.',
      },
      {
        question: 'How do you handle permits and site safety?',
        questionAr: 'كيف تتعاملون مع التصاريح وسلامة الموقع؟',
        answer:
          'Each mission is planned with the relevant flight approvals, a method statement, crew roles, weather limits, and launch and landing controls before anyone flies.',
        answerAr:
          'تُخطط كل مهمة مع تصاريح الطيران اللازمة وبيان طريقة وأدوار الطاقم وحدود الطقس وضوابط الإقلاع والهبوط قبل بدء الطيران.',
      },
      {
        question: 'Can the same site be flown again later?',
        questionAr: 'هل يمكن إعادة مسح الموقع نفسه لاحقاً؟',
        answer:
          'Yes. Missions are designed to be repeated on the same flight logic so progress, change, or a new design phase can be compared with the original baseline.',
        answerAr:
          'نعم. تُصمم المهام لتعاد وفق منطق الطيران نفسه حتى يُقارن التقدم أو التغيير أو مرحلة التصميم الجديدة بخط الأساس الأصلي.',
      },
    ],
    ctaTitle: 'Plan an aerial survey',
    ctaTitleAr: 'خطط لمسح جوي',
    ctaDescription:
      'Share the site, the accuracy you need, and the files your team expects. We will propose the aircraft, the control, and the deliverable.',
    ctaDescriptionAr:
      'شارك موقع العمل والدقة المطلوبة والملفات التي يتوقعها فريقك. سنقترح الطائرة والضبط وشكل التسليم.',
    seoTitle: 'Aerial Survey | Shamal Technologies',
    seoDescription:
      'Aerial survey and topographic mapping in Saudi Arabia. Orthophotos, elevation models, contours, and GIS-ready outputs from Shamal Technologies.',
    seoKeywords:
      'aerial survey Saudi Arabia, drone mapping, topographic survey, orthomosaic, DEM, GIS survey, Shamal Technologies',
  },

  'construction-monitoring': {
    heroTitle: 'The build, recorded on a schedule',
    heroTitleAr: 'الإنشاء موثّق وفق جدول',
    heroDescription:
      'Repeat aerial capture that turns a construction programme into a visual, measurable record — progress maps, comparison sets, and stakeholder reporting from the same flight lines.',
    heroDescriptionAr:
      'التقاط جوي متكرر يحوّل برنامج الإنشاء إلى سجل بصري قابل للقياس: خرائط تقدم ومجموعات مقارنة وتقارير لأصحاب المصلحة من خطوط الطيران نفسها.',
    overviewTitle: 'Same lines, same angles, every cycle',
    overviewTitleAr: 'الخطوط نفسها والزوايا نفسها في كل دورة',
    overview:
      'Construction monitoring only works if each visit can be compared with the last. Shamal flies pre-agreed lines and camera angles on a set rhythm — weekly on long programmes — and returns photo, video, and map sets the project team can review without walking the site.\n\nThe record is built for documentation and coordination: orthomosaics, comparison maps, and progress evidence that shortens the time spent assembling updates for consultants, owners, and site leadership.',
    overviewAr:
      'لا تنفع مراقبة الإنشاء إلا إذا أمكن مقارنة كل زيارة بالتي قبلها. تحلق شمل على خطوط وزوايا كاميرا متفق عليها بإيقاع ثابت — أسبوعياً في البرامج الطويلة — وتعيد مجموعات صور وفيديو وخرائط يراجعها فريق المشروع دون التجول في الموقع.\n\nيُبنى السجل للتوثيق والتنسيق: صور مصححة وخرائط مقارنة وأدلة تقدم تختصر وقت إعداد التحديثات للاستشاريين والمالك وقيادة الموقع.',
    benefits: [
      {
        title: 'A record that can be compared',
        titleAr: 'سجل قابل للمقارنة',
        description: 'Consistent flight lines and camera angles so this week sits directly against last week.',
        descriptionAr: 'خطوط طيران وزوايا كاميرا ثابتة حتى يُوضع أسبوع هذا الأسبوع مقابل الأسبوع الماضي مباشرة.',
      },
      {
        title: 'Less time assembling updates',
        titleAr: 'وقت أقل في تجهيز التحديثات',
        description: 'Photo, video, and map sets replace long ground walkthroughs as the basis for progress reporting.',
        descriptionAr: 'مجموعات الصور والفيديو والخرائط تحل محل الجولات الأرضية الطويلة كأساس لتقرير التقدم.',
      },
      {
        title: 'Visible to people off the site',
        titleAr: 'مرئي لمن هم خارج الموقع',
        description: 'Owners, consultants, and leadership see the same evidence without travelling to the project.',
        descriptionAr: 'يرى المالك والاستشاري والقيادة الدليل نفسه دون السفر إلى المشروع.',
      },
      {
        title: 'Suitable for long programmes',
        titleAr: 'مناسب للبرامج الطويلة',
        description: 'The workflow is built to run for the life of a build, not as a one-off showcase flight.',
        descriptionAr: 'مسار العمل مبني ليمتد طوال عمر الإنشاء، لا كطلعة استعراض لمرة واحدة.',
      },
      {
        title: 'Mapped, not only filmed',
        titleAr: 'مُخريط لا مصوَّر فقط',
        description: 'Orthomosaics and comparison maps sit alongside video so progress can be located, not just watched.',
        descriptionAr: 'ترافق الصور المصححة وخرائط المقارنة الفيديو حتى يُحدَّد التقدم لا أن يُشاهَد فقط.',
      },
      {
        title: 'One partner for the cadence',
        titleAr: 'شريك واحد لإيقاع العمل',
        description: 'Planning, flying, processing, and the progress pack delivered on the schedule you set.',
        descriptionAr: 'التخطيط والطيران والمعالجة وحزمة التقدم تُسلَّم وفق الجدول الذي تحدده.',
      },
    ],
    applications: [
      {
        title: 'Weekly progress documentation',
        titleAr: 'توثيق التقدم الأسبوعي',
        description: 'A standing capture cycle across the build, issued as photo, video, and map evidence.',
        descriptionAr: 'دورة التقاط ثابتة طوال الإنشاء، تُصدر كأدلة صور وفيديو وخرائط.',
      },
      {
        title: 'Consultant and owner reporting',
        titleAr: 'تقارير الاستشاري والمالك',
        description: 'Comparison views that make sequence, delay, and completed work easier to explain.',
        descriptionAr: 'عروض مقارنة تسهّل شرح التسلسل والتأخير والأعمال المنجزة.',
      },
      {
        title: 'Industrial and large sites',
        titleAr: 'المواقع الصناعية والكبيرة',
        description: 'Wide construction areas covered in one planned mission instead of a partial ground tour.',
        descriptionAr: 'تغطية مساحات الإنشاء الواسعة في مهمة مخططة واحدة بدلاً من جولة أرضية جزئية.',
      },
      {
        title: 'Earthworks and civil packages',
        titleAr: 'أعمال الحفر والحزم المدنية',
        description: 'Surface change made visible between cycles for teams managing levels and sequencing.',
        descriptionAr: 'إظهار تغير السطح بين الدورات للفرق التي تدير المناسيب والتسلسل.',
      },
      {
        title: 'Remote project oversight',
        titleAr: 'إشراف عن بعد على المشروع',
        description: 'A shared visual record for stakeholders who are not based on site.',
        descriptionAr: 'سجل بصري مشترك لأصحاب المصلحة غير المقيمين في الموقع.',
      },
      {
        title: 'Close-out and claims support',
        titleAr: 'دعم الإغلاق والمطالبات',
        description: 'A dated archive of what the site looked like at each capture, kept in one sequence.',
        descriptionAr: 'أرشيف مؤرخ لشكل الموقع في كل التقاط، محفوظ في تسلسل واحد.',
      },
    ],
    technologies: [
      {
        name: 'Repeat flight plans',
        nameAr: 'خطط طيران متكررة',
        description: 'Locked lines and altitudes so every cycle is comparable with the last.',
        descriptionAr: 'خطوط وارتفاعات ثابتة حتى تكون كل دورة قابلة للمقارنة بالسابقة.',
      },
      {
        name: 'Progress orthomosaics',
        nameAr: 'صور مصححة للتقدم',
        description: 'Georeferenced site maps produced on the same processing path each visit.',
        descriptionAr: 'خرائط موقع مسندة جغرافياً تُنتج بمسار المعالجة نفسه في كل زيارة.',
      },
      {
        name: 'Comparison mapping',
        nameAr: 'خرائط المقارنة',
        description: 'Side-by-side and overlay views that show what changed since the previous capture.',
        descriptionAr: 'عروض جنباً إلى جنب وتركيب تُظهر ما تغير منذ الالتقاط السابق.',
      },
      {
        name: 'Photo and video evidence',
        nameAr: 'أدلة الصور والفيديو',
        description: 'Oblique and overview imagery for meetings where a map alone is not enough.',
        descriptionAr: 'صور مائلة وعامة للاجتماعات التي لا تكفي فيها الخريطة وحدها.',
      },
      {
        name: 'Stakeholder packs',
        nameAr: 'حزم أصحاب المصلحة',
        description: 'A consistent reporting set rather than a new format every week.',
        descriptionAr: 'مجموعة تقارير ثابتة بدلاً من صيغة جديدة كل أسبوع.',
      },
      {
        name: 'Secure data handover',
        nameAr: 'تسليم بيانات منضبط',
        description: 'Controlled transfer and storage of project imagery and maps.',
        descriptionAr: 'نقل وتخزين منضبط لصور المشروع وخرائطه.',
      },
    ],
    faqs: [
      {
        question: 'How often should a construction site be flown?',
        questionAr: 'كم مرة ينبغي تصوير موقع الإنشاء؟',
        answer:
          'It depends on the pace of the build. Long programmes are often flown weekly so the record stays continuous. We agree the rhythm before the first mission and keep it stable.',
        answerAr:
          'يعتمد ذلك على وتيرة الإنشاء. غالباً ما تُحلَّق البرامج الطويلة أسبوعياً ليبقى السجل متصلاً. نتفق على الإيقاع قبل المهمة الأولى ونثبّته.',
      },
      {
        question: 'What do we receive after each visit?',
        questionAr: 'ماذا نستلم بعد كل زيارة؟',
        answer:
          'A progress set: photos, video, and map products such as an orthomosaic and comparison views, packaged for the project team rather than left as raw flight data.',
        answerAr:
          'مجموعة تقدم: صور وفيديو ومنتجات خرائط مثل الصورة المصححة وعروض المقارنة، مجهزة لفريق المشروع لا كبيانات طيران خام.',
      },
      {
        question: 'Will the images line up from week to week?',
        questionAr: 'هل تتطابق الصور من أسبوع إلى أسبوع؟',
        answer:
          'That is the point of the method. Flight lines and camera angles are repeated so reviewers are looking at the same view, not a new composition each time.',
        answerAr:
          'هذا هو جوهر الطريقة. تُعاد خطوط الطيران وزوايا الكاميرا ليرى المراجعون المشهد نفسه لا تكويناً جديداً في كل مرة.',
      },
      {
        question: 'Can this replace site walks entirely?',
        questionAr: 'هل يلغي ذلك الجولات الميدانية بالكامل؟',
        answer:
          'It removes most of the documentation walking. Inspections that need a physical check still happen on the ground. The aerial record is what the wider team uses to see progress.',
        answerAr:
          'يلغي معظم جولات التوثيق. الفحوصات التي تحتاج تحققاً مادياً تبقى على الأرض. والسجل الجوي هو ما يستخدمه الفريق الأوسع لرؤية التقدم.',
      },
      {
        question: 'Do you work across multi-year builds?',
        questionAr: 'هل تعملون على مشاريع تمتد لسنوات؟',
        answer:
          'Yes. The service is designed as a monitoring programme: the same plan, the same outputs, and a continuous archive for as long as the project needs it.',
        answerAr:
          'نعم. الخدمة مصممة كبرنامج مراقبة: الخطة نفسها والمخرجات نفسها وأرشيف متصل طالما احتاج المشروع ذلك.',
      },
    ],
    ctaTitle: 'Set up a monitoring cycle',
    ctaTitleAr: 'أعد دورة مراقبة',
    ctaDescription:
      'Tell us the site, the reporting audience, and how often you need an update. We will lock the flight plan and the deliverable.',
    ctaDescriptionAr:
      'أخبرنا بالموقع وجمهور التقارير ووتيرة التحديث التي تحتاجها. سنثبّت خطة الطيران وشكل التسليم.',
    seoTitle: 'Construction Monitoring | Shamal Technologies',
    seoDescription:
      'Drone construction progress monitoring in Saudi Arabia. Repeat orthomosaics, comparison maps, and stakeholder reporting from Shamal Technologies.',
    seoKeywords:
      'construction monitoring Saudi Arabia, drone progress monitoring, orthomosaic construction, site documentation, Shamal Technologies',
  },

  'asset-inspection': {
    heroTitle: 'Defects found before they become failures',
    heroTitleAr: 'اكتشاف العيوب قبل أن تصبح أعطالاً',
    heroDescription:
      'Thermal and visual inspection of power lines, solar arrays, facades, and industrial assets — defects located and mapped without routine shutdowns or rope access.',
    heroDescriptionAr:
      'فحص حراري وبصري لخطوط الطاقة ومصفوفات الطاقة الشمسية والواجهات والأصول الصناعية — تحديد العيوب ورسمها دون إيقاف روتيني للتشغيل أو وصول بالحبال.',
    overviewTitle: 'Close enough to see the fault, far enough to stay safe',
    overviewTitleAr: 'قريب بما يكفي لرؤية العطل، وبعيد بما يكفي للبقاء آمناً',
    overview:
      'Manual patrols and rope access miss early defects, take crews into the work face, and leave the record on paper. Shamal inspects energised lines, rooftop solar, and building envelopes with synchronised RGB and thermal sensors, then georeferences the findings so maintenance goes to the right component.\n\nThe output is an inspection product: imagery, anomaly locations, and a report your operations team can act on — not a reel of footage that still needs interpretation.',
    overviewAr:
      'تفوّت الدوريات اليدوية والوصول بالحبال العيوب المبكرة، وتضع الفرق في واجهة العمل، وتترك السجل على الورق. تفحص شمل الخطوط المكهربة وأسطح الطاقة الشمسية وغلاف المباني بحساسات بصرية وحرارية متزامنة، ثم تُسند النتائج جغرافياً حتى تصل الصيانة إلى المكوّن الصحيح.\n\nالمخرج منتج فحص: صور ومواقع الشذوذ وتقرير يستطيع فريق التشغيل التصرف بناءً عليه — لا مقطع تصوير ما زال يحتاج تفسيراً.',
    benefits: [
      {
        title: 'Earlier detection',
        titleAr: 'اكتشاف أبكر',
        description: 'Thermal and visual passes catch developing faults before they become outages or leaks.',
        descriptionAr: 'ترصد الجولات الحرارية والبصرية الأعطال المتطورة قبل أن تصبح انقطاعات أو تسربات.',
      },
      {
        title: 'No routine shutdown',
        titleAr: 'دون إيقاف تشغيلي روتيني',
        description: 'Lines and facilities stay in service while the aircraft collects the inspection record.',
        descriptionAr: 'تبقى الخطوط والمنشآت في الخدمة بينما تجمع الطائرة سجل الفحص.',
      },
      {
        title: 'Crews off ropes and roofs',
        titleAr: 'الفرق بعيداً عن الحبال والأسطح',
        description: 'Facades, arrays, and elevated assets are inspected without scaffolding as the default method.',
        descriptionAr: 'تُفحص الواجهات والمصفوفات والأصول المرتفعة دون أن تكون السقالات هي الطريقة الافتراضية.',
      },
      {
        title: 'Findings you can dispatch',
        titleAr: 'نتائج يمكن إرسال فرق إليها',
        description: 'Anomalies are georeferenced so maintenance is targeted, not a second search of the asset.',
        descriptionAr: 'تُسند الشذوذات جغرافياً حتى تكون الصيانة موجهة لا بحثاً ثانياً في الأصل.',
      },
      {
        title: 'One pass, two sensors',
        titleAr: 'مرور واحد وحساسان',
        description: 'Visible detail and thermal behaviour captured together, so the defect has context.',
        descriptionAr: 'تُلتقط التفاصيل المرئية والسلوك الحراري معاً حتى يكون للعيب سياق.',
      },
      {
        title: 'A digital inspection file',
        titleAr: 'ملف فحص رقمي',
        description: 'Reports replace manual notebooks and give the next inspection a baseline to compare.',
        descriptionAr: 'تحل التقارير محل الدفاتر اليدوية وتعطي الفحص التالي خط أساس للمقارنة.',
      },
    ],
    applications: [
      {
        title: 'Power transmission and distribution',
        titleAr: 'نقل الطاقة وتوزيعها',
        description:
          'RGB and thermal inspection of lines, insulators, and connectors while the circuit stays energised.',
        descriptionAr:
          'فحص بصري وحراري للخطوط والعوازل والموصلات مع بقاء الدائرة مكهرباً.',
      },
      {
        title: 'Solar and rooftop assets',
        titleAr: 'أصول الطاقة الشمسية والأسطح',
        description:
          'Array-wide thermal assessment in a single flight, with hot spots located for maintenance.',
        descriptionAr:
          'تقييم حراري لكامل المصفوفة في طلعة واحدة، مع تحديد النقاط الساخنة للصيانة.',
      },
      {
        title: 'Building facades',
        titleAr: 'واجهات المباني',
        description:
          'Centimetre-level visual mapping plus thermal evidence of moisture, leaks, and heat loss.',
        descriptionAr:
          'رسم بصري بمستوى السنتيمتر مع دليل حراري للرطوبة والتسرب وفقد الحرارة.',
      },
      {
        title: 'Industrial facilities',
        titleAr: 'المنشآت الصناعية',
        description:
          'Plant and facility envelopes inspected without interrupting operations on the ground.',
        descriptionAr:
          'فحص غلاف المصنع والمنشأة دون تعطيل العمليات على الأرض.',
      },
      {
        title: 'Utilities and energy sites',
        titleAr: 'مواقع المرافق والطاقة',
        description:
          'Repeat inspection programmes for distributed assets that are slow and risky to patrol on foot.',
        descriptionAr:
          'برامج فحص متكررة للأصول الموزعة التي تكون دورياتها سيراً بطيئة وخطرة.',
      },
      {
        title: 'Facilities management',
        titleAr: 'إدارة المرافق',
        description:
          'A documented condition baseline for commercial and industrial buildings before defects spread.',
        descriptionAr:
          'خط أساس موثّق لحالة المباني التجارية والصناعية قبل انتشار العيوب.',
      },
    ],
    technologies: [
      {
        name: 'Synchronised RGB and thermal',
        nameAr: 'تصوير بصري وحراري متزامن',
        description: 'Both sensors on the same pass so every anomaly has a visible location.',
        descriptionAr: 'الحساسان في المرور نفسه حتى يكون لكل شذوذ موقع مرئي.',
      },
      {
        name: 'Enterprise multirotor platforms',
        nameAr: 'منصات متعددة المراوح احترافية',
        description: 'Stable hover and close approach for towers, facades, and linear assets.',
        descriptionAr: 'تحليق ثابت واقتراب دقيق للأبراج والواجهات والأصول الخطية.',
      },
      {
        name: 'Georeferenced defect logs',
        nameAr: 'سجلات عيوب مسندة جغرافياً',
        description: 'Findings placed on the asset so work orders point to a component, not a region.',
        descriptionAr: 'تُوضع النتائج على الأصل حتى تشير أوامر العمل إلى مكوّن لا إلى منطقة.',
      },
      {
        name: 'Facade mapping',
        nameAr: 'رسم الواجهات',
        description: 'High-detail 2D maps and 3D models of building envelopes for condition records.',
        descriptionAr: 'خرائط ثنائية ومجسمات ثلاثية عالية التفصيل لغلاف المبنى كسجل حالة.',
      },
      {
        name: 'Non-contact inspection',
        nameAr: 'فحص دون تلامس',
        description: 'No shutdown and no contact with the asset as the standard operating method.',
        descriptionAr: 'دون إيقاف ودون تلامس مع الأصل كطريقة التشغيل المعتادة.',
      },
      {
        name: 'Inspection reporting',
        nameAr: 'تقارير الفحص',
        description: 'Imagery, severity context, and recommended follow-up in one technical report.',
        descriptionAr: 'صور وسياق الخطورة والمتابعة الموصى بها في تقرير فني واحد.',
      },
    ],
    faqs: [
      {
        question: 'Which assets can you inspect?',
        questionAr: 'ما الأصول التي يمكنكم فحصها؟',
        answer:
          'Power lines, substations context, solar arrays, building facades, and industrial or utility assets where a close visual or thermal view is safer from the air than from a rope or a roof.',
        answerAr:
          'خطوط الطاقة وسياق المحطات ومصفوفات الطاقة الشمسية وواجهات المباني والأصول الصناعية أو الخدمية التي يكون منظرها البصري أو الحراري القريب أكثر أماناً من الجو منه من الحبل أو السطح.',
      },
      {
        question: 'Do we have to shut the line or the facility down?',
        questionAr: 'هل يجب إيقاف الخط أو المنشأة؟',
        answer:
          'No. The method is non-contact. Energised lines and operating facilities are inspected from a planned standoff, subject to the site’s safety rules.',
        answerAr:
          'لا. الطريقة دون تلامس. تُفحص الخطوط المكهربة والمنشآت العاملة من مسافة مخططة، وفق قواعد السلامة في الموقع.',
      },
      {
        question: 'What is in the inspection report?',
        questionAr: 'ماذا يتضمن تقرير الفحص؟',
        answer:
          'Georeferenced imagery, the thermal or visual finding, and enough location detail for maintenance to go to the component. Methodology and coverage are documented with the file.',
        answerAr:
          'صور مسندة جغرافياً والنتيجة الحرارية أو البصرية وتفصيل موقع يكفي لوصول الصيانة إلى المكوّن. وتُوثَّق المنهجية والتغطية مع الملف.',
      },
      {
        question: 'How detailed is a facade inspection?',
        questionAr: 'ما مدى تفصيل فحص الواجهة؟',
        answer:
          'Visual capture is planned for centimetre-level mapping, with thermal added to reveal moisture, leaks, and heat loss that a visual pass alone will not show.',
        answerAr:
          'يُخطط الالتقاط البصري لرسم بمستوى السنتيمتر، ويُضاف الحراري لإظهار الرطوبة والتسرب وفقد الحرارة التي لا يظهرها المرور البصري وحده.',
      },
      {
        question: 'Can inspections be repeated on a programme?',
        questionAr: 'هل يمكن تكرار الفحص ضمن برنامج؟',
        answer:
          'Yes. Assets that need a condition history are flown on an agreed cycle so new findings can be compared with the previous record.',
        answerAr:
          'نعم. تُحلَّق الأصول التي تحتاج سجل حالة وفق دورة متفق عليها حتى تُقارن النتائج الجديدة بالسجل السابق.',
      },
    ],
    ctaTitle: 'Scope an asset inspection',
    ctaTitleAr: 'حدد نطاق فحص الأصول',
    ctaDescription:
      'Send the asset type, the length or area, and whether you need thermal, visual, or both. We will propose the mission and the report.',
    ctaDescriptionAr:
      'أرسل نوع الأصل والطول أو المساحة وما إذا كنت تحتاج فحصاً حرارياً أو بصرياً أو كليهما. سنقترح المهمة والتقرير.',
    seoTitle: 'Asset Inspection | Shamal Technologies',
    seoDescription:
      'Drone asset inspection in Saudi Arabia. Thermal and visual surveys of power lines, solar arrays, facades, and industrial facilities by Shamal Technologies.',
    seoKeywords:
      'asset inspection Saudi Arabia, drone thermal inspection, powerline inspection, facade inspection, solar inspection, Shamal Technologies',
  },

  'bathymetric-underwater-survey': {
    heroTitle: 'Marine sites, seen before the plume moves',
    heroTitleAr: 'المواقع البحرية تُرى قبل أن يتحرك العكر',
    heroDescription:
      'Coastal, port, and near-shore survey for dredging, marine infrastructure, and environmental control — surface intelligence that supports bathymetric and underwater programmes.',
    heroDescriptionAr:
      'مسح ساحلي ومينائي وقريب من الشاطئ لأعمال التجريف والبنية البحرية والرقابة البيئية — معلومات سطحية تدعم برامج المسح الباثيمتري وتحت الماء.',
    overviewTitle: 'The water surface, mapped in time to act',
    overviewTitleAr: 'سطح الماء مُرسم في وقت يسمح بالتصرف',
    overview:
      'Ports, dredge faces, and long coastlines are slow to cover by boat and difficult to interpret from a single visit. Shamal flies repeat surveys over marine works and shorelines, processes georeferenced orthomosaics, and uses multispectral indices to show where sediment and other surface change are moving.\n\nWhere a project also needs bathymetric or underwater measurement, the aerial record gives the team a same-day picture of the work face, the containment line, and the surrounding habitat — so hydrographic effort is aimed, not spent searching.',
    overviewAr:
      'الموانئ وواجهات التجريف والسواحل الطويلة بطيئة التغطية بالقارب ويصعب تفسيرها من زيارة واحدة. تنفذ شمل مسوحاً متكررة فوق الأعمال البحرية والشواطئ، وتعالج صوراً مصححة مسندة جغرافياً، وتستخدم مؤشرات متعددة الأطياف لإظهار اتجاه حركة الرواسب وغيرها من التغير السطحي.\n\nوحين يحتاج المشروع أيضاً قياساً باثيمترياً أو تحت الماء، يمنح السجل الجوي الفريق صورة في اليوم نفسه لواجهة العمل وخط الاحتواء والموائل المحيطة — فيُوجَّه الجهد الهيدروغرافي بدلاً من إنفاقه في البحث.',
    benefits: [
      {
        title: 'Same-day surface evidence',
        titleAr: 'دليل سطحي في اليوم نفسه',
        description: 'Orthomosaics and index maps delivered fast enough to act while the dredge is still working.',
        descriptionAr: 'صور مصححة وخرائط مؤشرات تُسلَّم بسرعة تسمح بالتصرف أثناء استمرار التجريف.',
      },
      {
        title: 'Sediment made visible',
        titleAr: 'الرواسب تصبح مرئية',
        description: 'Multispectral mapping shows plume density and spread past a containment line.',
        descriptionAr: 'يُظهر الرسم متعدد الأطياف كثافة العكر وانتشاره خارج خط الاحتواء.',
      },
      {
        title: 'Less exposure on the water',
        titleAr: 'تعرض أقل على الماء',
        description: 'Active dredge faces and long shores are assessed from the air before boats or divers are tasked.',
        descriptionAr: 'تُقيَّم واجهات التجريف النشطة والشواطئ الطويلة من الجو قبل تكليف القوارب أو الغواصين.',
      },
      {
        title: 'Repeatable marine monitoring',
        titleAr: 'مراقبة بحرية قابلة للتكرار',
        description: 'The same flight logic can be flown again as the works or the season change.',
        descriptionAr: 'يمكن إعادة منطق الطيران نفسه مع تغير الأعمال أو الموسم.',
      },
      {
        title: 'Context for hydrographic teams',
        titleAr: 'سياق لفرق المسح الهيدروغرافي',
        description: 'A georeferenced picture of where to focus bathymetric and underwater effort.',
        descriptionAr: 'صورة مسندة جغرافياً تحدد أين يُركَّز الجهد الباثيمتري وتحت الماء.',
      },
      {
        title: 'Environmental evidence',
        titleAr: 'دليل بيئي',
        description: 'Habitat and plume records that support compliance conversations with a map, not a description.',
        descriptionAr: 'سجلات موائل وعكر تدعم نقاش الالتزام بخريطة لا بوصف.',
      },
    ],
    applications: [
      {
        title: 'Port and dredging works',
        titleAr: 'أعمال الموانئ والتجريف',
        description: 'Monitor sediment leaving the work area and confirm whether it stays inside the curtain.',
        descriptionAr: 'مراقبة الرواسب الخارجة من منطقة العمل والتأكد من بقائها داخل الستارة.',
      },
      {
        title: 'Coastline baselines',
        titleAr: 'خطوط أساس السواحل',
        description: 'Map long shores and near-shore waters that are impractical to walk or to cover slowly by boat.',
        descriptionAr: 'رسم الشواطئ الطويلة والمياه القريبة التي يصعب قطعها سيراً أو تغطيتها ببطء بالقارب.',
      },
      {
        title: 'Marine infrastructure',
        titleAr: 'البنية التحتية البحرية',
        description: 'Entrance channels, reclamation edges, and coastal structures documented as they change.',
        descriptionAr: 'توثيق قنوات المداخل وحواف الردم والمنشآت الساحلية أثناء تغيرها.',
      },
      {
        title: 'Habitat and water-quality context',
        titleAr: 'سياق الموائل وجودة المياه',
        description: 'Surface indicators around sensitive coastal habitat during active marine works.',
        descriptionAr: 'مؤشرات سطحية حول الموائل الساحلية الحساسة أثناء الأعمال البحرية النشطة.',
      },
      {
        title: 'Support to bathymetric campaigns',
        titleAr: 'دعم حملات المسح الباثيمتري',
        description: 'Aerial context that tells a hydrographic crew where the change, the plume, or the priority is.',
        descriptionAr: 'سياق جوي يخبر طاقم المسح الهيدروغرافي أين التغيير أو العكر أو الأولوية.',
      },
      {
        title: 'Environmental reporting',
        titleAr: 'التقارير البيئية',
        description: 'Georeferenced maps and a method statement suitable for project and regulator files.',
        descriptionAr: 'خرائط مسندة جغرافياً وبيان طريقة يصلحان لملفات المشروع والجهة المنظمة.',
      },
    ],
    technologies: [
      {
        name: 'Repeat UAV survey',
        nameAr: 'مسح جوي متكرر',
        description: 'Planned flights over the dredge, the channel, or the shoreline on an agreed cycle.',
        descriptionAr: 'طلعات مخططة فوق التجريف أو القناة أو الشاطئ وفق دورة متفق عليها.',
      },
      {
        name: 'Georeferenced orthomosaics',
        nameAr: 'صور مصححة مسندة جغرافياً',
        description: 'A measurable image map of the marine work face and its surroundings.',
        descriptionAr: 'خريطة صور قابلة للقياس لواجهة العمل البحري ومحيطها.',
      },
      {
        name: 'Multispectral indices',
        nameAr: 'مؤشرات متعددة الأطياف',
        description: 'Index maps that separate plume density and surface change from ordinary water.',
        descriptionAr: 'خرائط مؤشرات تفصل كثافة العكر والتغير السطحي عن الماء العادي.',
      },
      {
        name: 'Centimetre-level shoreline detail',
        nameAr: 'تفصيل شاطئي بمستوى السنتيمتر',
        description: 'Ground resolution tight enough to pinpoint where material escapes a boundary.',
        descriptionAr: 'دقة أرضية كافية لتحديد موضع خروج المواد من الحد.',
      },
      {
        name: 'Fixed-wing coastal coverage',
        nameAr: 'تغطية ساحلية ثابتة الجناح',
        description: 'Long endurance for coastline and near-shore extents that a short hover cannot cover.',
        descriptionAr: 'تحمل طويل للسواحل والنطاق القريب من الشاطئ الذي لا يغطيه تحليق قصير.',
      },
      {
        name: 'GIS delivery',
        nameAr: 'تسليم نظم معلومات جغرافية',
        description: 'Maps and notes issued for overlay with hydrographic and environmental layers.',
        descriptionAr: 'خرائط وملاحظات تُصدر للتركيب مع الطبقات الهيدروغرافية والبيئية.',
      },
    ],
    faqs: [
      {
        question: 'Do you replace a bathymetric survey vessel?',
        questionAr: 'هل تحلون محل سفينة المسح الباثيمتري؟',
        answer:
          'No. We provide the aerial and surface picture — orthomosaics, plume and shoreline maps, and repeat monitoring — and align it with bathymetric or underwater work when that measurement is part of the project.',
        answerAr:
          'لا. نقدم الصورة الجوية والسطحية: صوراً مصححة وخرائط عكر وشاطئ ومراقبة متكررة، ونوائمها مع العمل الباثيمتري أو تحت الماء حين يكون ذلك القياس جزءاً من المشروع.',
      },
      {
        question: 'How quickly can a dredge plume be mapped?',
        questionAr: 'ما سرعة رسم عكر التجريف؟',
        answer:
          'Repeat flights are processed into a georeferenced plume map on a same-day cycle, so the team can see whether sediment has crossed the containment line while the work is still underway.',
        answerAr:
          'تُعالج الطلعات المتكررة إلى خريطة عكر مسندة جغرافياً في دورة اليوم نفسه، ليرى الفريق إن كانت الرواسب قد تجاوزت خط الاحتواء والعمل ما زال قائماً.',
      },
      {
        question: 'What marine sites is this suited to?',
        questionAr: 'ما المواقع البحرية المناسبة لهذه الخدمة؟',
        answer:
          'Ports, entrance channels, dredging and reclamation, coastal infrastructure, and environmental monitoring along shorelines and near-shore water.',
        answerAr:
          'الموانئ وقنوات الدخول والتجريف والردم والبنية الساحلية والمراقبة البيئية على الشواطئ والمياه القريبة.',
      },
      {
        question: 'What files do we receive?',
        questionAr: 'ما الملفات التي نستلمها؟',
        answer:
          'Georeferenced orthomosaics, multispectral index maps where used, and a short technical note on method, timing, and what the map shows.',
        answerAr:
          'صوراً مصححة مسندة جغرافياً، وخرائط مؤشرات متعددة الأطياف عند استخدامها، ومذكرة فنية قصيرة عن المنهج والتوقيت وما تُظهره الخريطة.',
      },
      {
        question: 'Can long coastlines be covered in one mission?',
        questionAr: 'هل يمكن تغطية السواحل الطويلة في مهمة واحدة؟',
        answer:
          'Yes. Fixed-wing aircraft are used when the requirement is endurance and area. Closer confirmation, when needed, is flown separately on a multirotor.',
        answerAr:
          'نعم. تُستخدم الطائرات ثابتة الجناح حين يكون المطلوب تحملاً ومساحة. والتأكيد الأقرب، عند الحاجة، يُنفذ بشكل منفصل بطائرة متعددة المراوح.',
      },
    ],
    ctaTitle: 'Discuss a marine survey',
    ctaTitleAr: 'ناقش مسحاً بحرياً',
    ctaDescription:
      'Share the works area, the environmental constraint, and whether bathymetric data is already part of the project. We will propose the aerial scope around it.',
    ctaDescriptionAr:
      'شارك منطقة الأعمال والقيد البيئي وما إذا كانت البيانات الباثيمترية جزءاً من المشروع أصلاً. سنقترح النطاق الجوي حول ذلك.',
    seoTitle: 'Bathymetric & Underwater Survey Support | Shamal Technologies',
    seoDescription:
      'Coastal, port, and dredge monitoring in Saudi Arabia. Orthomosaics, sediment mapping, and aerial support for marine survey programmes by Shamal Technologies.',
    seoKeywords:
      'marine survey Saudi Arabia, dredging monitoring, coastal mapping, bathymetric survey support, port survey, Shamal Technologies',
  },

  'gis-remote-sensing': {
    heroTitle: 'Field data your systems can use',
    heroTitleAr: 'بيانات ميدانية تستطيع أنظمتكم استخدامها',
    heroDescription:
      'From aerial capture to decision-ready geospatial products: orthomosaics, terrain models, point clouds, change detection, and GIS layers for technical and business teams.',
    heroDescriptionAr:
      'من الالتقاط الجوي إلى منتجات جغرافية جاهزة للقرار: صور مصححة ونماذج تضاريس وسحب نقاط وكشف تغيّر وطبقات نظم معلومات جغرافية للفرق الفنية والإدارية.',
    overviewTitle: 'The value is the usable data product',
    overviewTitleAr: 'القيمة في منتج البيانات القابل للاستخدام',
    overview:
      'A flight is only useful once it becomes a file someone can measure, compare, and load into GIS, a dashboard, or a design model. Shamal runs that full chain: define the area and the acceptance criteria, plan the mission, capture, process, analyse, and deliver.\n\nRemote sensing sits inside the same workflow. Multispectral indices, classification, and repeat coverage turn imagery into layers — vegetation, water, change, assets — instead of leaving interpretation to a visual guess.',
    overviewAr:
      'لا تنفع الطلعة إلا حين تصبح ملفاً يمكن قياسه ومقارنته وتحميله في نظم المعلومات أو لوحة المتابعة أو نموذج التصميم. تدير شمل هذه السلسلة كاملة: تحديد المنطقة ومعايير القبول، وتخطيط المهمة، والالتقاط، والمعالجة، والتحليل، والتسليم.\n\nويقع الاستشعار عن بعد داخل مسار العمل نفسه. تحوّل المؤشرات متعددة الأطياف والتصنيف والتغطية المتكررة الصور إلى طبقات — غطاء نباتي وماء وتغيّر وأصول — بدلاً من ترك التفسير لتخمين بصري.',
    benefits: [
      {
        title: 'Outputs, not footage',
        titleAr: 'مخرجات لا لقطات',
        description: 'Orthomosaics, terrain models, point clouds, contours, and reports structured for downstream use.',
        descriptionAr: 'صور مصححة ونماذج تضاريس وسحب نقاط وخطوط كنتور وتقارير مهيأة للاستخدام اللاحق.',
      },
      {
        title: 'Specified before the flight',
        titleAr: 'تُحدد قبل الطيران',
        description: 'Area, accuracy, format, and acceptance criteria agreed so the product matches the decision.',
        descriptionAr: 'الاتفاق على المساحة والدقة والصيغة ومعايير القبول حتى يطابق المنتج القرار.',
      },
      {
        title: 'Ready for GIS and digital twins',
        titleAr: 'جاهزة لنظم المعلومات والتوائم الرقمية',
        description: 'Layers and models prepared for overlay, analysis, and spatial systems you already run.',
        descriptionAr: 'طبقات ونماذج مهيأة للتركيب والتحليل والأنظمة المكانية التي تشغّلونها.',
      },
      {
        title: 'Change you can measure',
        titleAr: 'تغيّر يمكن قياسه',
        description: 'Repeat missions compared against a baseline for progress, encroachment, or new activity.',
        descriptionAr: 'مقارنة المهام المتكررة بخط أساس للتقدم أو التعدي أو النشاط الجديد.',
      },
      {
        title: 'Remote sensing with a location',
        titleAr: 'استشعار عن بعد بموقع',
        description: 'Indices and classifications delivered as georeferenced layers, not as standalone pictures.',
        descriptionAr: 'مؤشرات وتصنيفات تُسلَّم كطبقات مسندة جغرافياً لا كصور منفصلة.',
      },
      {
        title: 'Documented method',
        titleAr: 'منهج موثّق',
        description: 'Each package includes how the data was captured, processed, and checked.',
        descriptionAr: 'تتضمن كل حزمة كيفية الالتقاط والمعالجة والفحص.',
      },
    ],
    applications: [
      {
        title: 'Asset and corridor basemaps',
        titleAr: 'خرائط أساس للأصول والممرات',
        description: 'A current, measurable image of distributed sites that office teams cannot visit every week.',
        descriptionAr: 'صورة حالية قابلة للقياس للمواقع الموزعة التي لا يستطيع فريق المكتب زيارتها كل أسبوع.',
      },
      {
        title: 'Engineering terrain products',
        titleAr: 'منتجات تضاريس هندسية',
        description: 'DSM, DTM, and contours for earthwork, drainage, and route decisions.',
        descriptionAr: 'نماذج سطح وتضاريس وخطوط كنتور لقرارات الحفر والتصريف والمسار.',
      },
      {
        title: 'Change detection programmes',
        titleAr: 'برامج كشف التغيّر',
        description: 'Baseline and repeat layers for construction progress, land activity, and encroachment.',
        descriptionAr: 'طبقات أساس وتكرار لتقدم الإنشاء ونشاط الأرض والتعدي.',
      },
      {
        title: 'Environmental indices',
        titleAr: 'مؤشرات بيئية',
        description: 'Vegetation, water, and land-cover layers derived from multispectral capture.',
        descriptionAr: 'طبقات غطاء نباتي وماء وغطاء أرضي مشتقة من التقاط متعدد الأطياف.',
      },
      {
        title: 'Digital twin inputs',
        titleAr: 'مدخلات التوأم الرقمي',
        description: 'Point clouds and 3D models that give a spatial base for facility and site models.',
        descriptionAr: 'سحب نقاط ومجسمات ثلاثية تعطي قاعدة مكانية لنماذج المنشأة والموقع.',
      },
      {
        title: 'Management reporting',
        titleAr: 'تقارير الإدارة',
        description: 'Maps plus a written method, measurements, and recommendations for non-GIS readers.',
        descriptionAr: 'خرائط مع منهج مكتوب وقياسات وتوصيات لمن لا يعمل على نظم المعلومات يومياً.',
      },
    ],
    technologies: [
      {
        name: 'Orthomosaic mapping',
        nameAr: 'رسم الصور المصححة',
        description: 'High-resolution georeferenced basemaps of a site, corridor, or facility.',
        descriptionAr: 'خرائط أساس عالية الدقة ومسندة جغرافياً لموقع أو ممر أو منشأة.',
      },
      {
        name: 'DSM, DTM, and contours',
        nameAr: 'نماذج السطح والتضاريس والكنتور',
        description: 'Terrain products for engineering and spatial analysis.',
        descriptionAr: 'منتجات تضاريس للهندسة والتحليل المكاني.',
      },
      {
        name: 'Point clouds and 3D models',
        nameAr: 'سحب النقاط والمجسمات',
        description: 'Spatial models for measurement and as input to a digital twin.',
        descriptionAr: 'نماذج مكانية للقياس وكمدخل لتوأم رقمي.',
      },
      {
        name: 'Multispectral remote sensing',
        nameAr: 'استشعار متعدد الأطياف',
        description: 'Band combinations and indices such as NDVI for vegetation and surface condition.',
        descriptionAr: 'تركيبات نطاقات ومؤشرات مثل NDVI للغطاء النباتي وحالة السطح.',
      },
      {
        name: 'Change detection',
        nameAr: 'كشف التغيّر',
        description: 'Repeat coverage compared against the baseline you already hold.',
        descriptionAr: 'تغطية متكررة تُقارن بخط الأساس الذي تحتفظون به.',
      },
      {
        name: 'GIS layer packages',
        nameAr: 'حزم طبقات نظم المعلومات',
        description: 'Reusable files with coordinate documentation and a technical report.',
        descriptionAr: 'ملفات قابلة لإعادة الاستخدام مع توثيق الإحداثيات وتقرير فني.',
      },
    ],
    faqs: [
      {
        question: 'What geospatial products can you deliver?',
        questionAr: 'ما المنتجات الجغرافية التي يمكنكم تسليمها؟',
        answer:
          'Depending on the brief: orthomosaics, DSM and DTM, contours, point clouds, 3D models, classified or index layers, change maps, and a technical report with method and measurements.',
        answerAr:
          'حسب الطلب: صوراً مصححة ونماذج سطح وتضاريس وخطوط كنتور وسحب نقاط ومجسمات ثلاثية وطبقات مصنفة أو مؤشرية وخرائط تغيّر وتقريراً فنياً بالمنهج والقياسات.',
      },
      {
        question: 'Is this only data processing, or do you also fly?',
        questionAr: 'هل هذه معالجة بيانات فقط أم تطيرون أيضاً؟',
        answer:
          'Both. The strongest result is the full chain — requirement, permits, capture, processing, analysis, and delivery. Processing of an agreed existing dataset can be scoped separately.',
        answerAr:
          'كلاهما. أفضل نتيجة هي السلسلة كاملة: المتطلب والتصاريح والالتقاط والمعالجة والتحليل والتسليم. ويمكن تحديد معالجة مجموعة بيانات قائمة بشكل منفصل.',
      },
      {
        question: 'Will the layers match our coordinate system?',
        questionAr: 'هل ستطابق الطبقات نظام الإحداثيات لدينا؟',
        answer:
          'Yes. The coordinate system and acceptance criteria are part of the definition step, and they are documented in the handover.',
        answerAr:
          'نعم. نظام الإحداثيات ومعايير القبول جزء من خطوة التحديد، ويُوثَّقان عند التسليم.',
      },
      {
        question: 'How is remote sensing different from a normal map?',
        questionAr: 'كيف يختلف الاستشعار عن بعد عن الخريطة العادية؟',
        answer:
          'A map shows what is visible. Multispectral capture adds bands the eye does not separate, so vegetation stress, water, and land cover can be classified and measured.',
        answerAr:
          'تُظهر الخريطة ما هو مرئي. ويضيف الالتقاط متعدد الأطياف نطاقات لا تفصلها العين، فيمكن تصنيف الإجهاد النباتي والماء والغطاء الأرضي وقياسه.',
      },
      {
        question: 'Can you detect change between two dates?',
        questionAr: 'هل يمكنكم كشف التغيّر بين تاريخين؟',
        answer:
          'Yes, when both dates are captured or supplied on a comparable specification. We use that pair to map progress, new activity, or encroachment.',
        answerAr:
          'نعم، حين يُلتقط التاريخان أو يُوفَّران بمواصفات قابلة للمقارنة. نستخدم الزوجين لرسم التقدم أو النشاط الجديد أو التعدي.',
      },
    ],
    ctaTitle: 'Define the data product',
    ctaTitleAr: 'حدد منتج البيانات',
    ctaDescription:
      'Tell us the decision the map has to support. We will specify the capture, the layers, and the format before anyone flies.',
    ctaDescriptionAr:
      'أخبرنا بالقرار الذي يجب أن تدعمه الخريطة. سنحدد الالتقاط والطبقات والصيغة قبل أن يطير أحد.',
    seoTitle: 'GIS & Remote Sensing | Shamal Technologies',
    seoDescription:
      'GIS and remote sensing in Saudi Arabia. Orthomosaics, terrain models, point clouds, change detection, and multispectral layers from Shamal Technologies.',
    seoKeywords:
      'GIS Saudi Arabia, remote sensing, orthomosaic, point cloud, change detection, NDVI, drone mapping, Shamal Technologies',
  },

  'environmental-monitoring': {
    heroTitle: 'Habitat and change, measured over time',
    heroTitleAr: 'الموائل والتغيّر تُقاس عبر الزمن',
    heroDescription:
      'Repeat monitoring of vegetation, coastlines, and environmental change — multispectral indices, orthomosaics, and GIS evidence for conservation and project compliance.',
    heroDescriptionAr:
      'مراقبة متكررة للغطاء النباتي والسواحل والتغيّر البيئي: مؤشرات متعددة الأطياف وصور مصححة وأدلة نظم معلومات للحفظ والالتزام في المشاريع.',
    overviewTitle: 'See stress and spread before they are obvious',
    overviewTitleAr: 'رؤية الإجهاد والانتشار قبل أن يصبحا واضحين',
    overview:
      'Environmental change is easy to miss until it is already visible from the ground. Shamal monitors vegetation health, coastal habitat, and marine works with repeat flights: RGB orthophotos for context, and multispectral imagery processed into indices such as NDVI so early stress can be mapped, not guessed.\n\nThe same approach covers sediment leaving a dredge area and long coastlines that boats and foot patrols cannot cover consistently. Deliverables are georeferenced maps and a record that can be flown again.',
    overviewAr:
      'يسهل تفويت التغيّر البيئي إلى أن يصبح ظاهراً من الأرض. تراقب شمل صحة الغطاء النباتي والموائل الساحلية والأعمال البحرية بطلعات متكررة: صور مصححة للسياق، وصور متعددة الأطياف تُعالج إلى مؤشرات مثل NDVI حتى يُرسم الإجهاد المبكر لا أن يُخمَّن.\n\nويغطي النهج نفسه الرواسب الخارجة من منطقة التجريف والسواحل الطويلة التي لا تغطيها القوارب والدوريات سيراً بشكل منتظم. المخرجات خرائط مسندة جغرافياً وسجل يمكن إعادة التحليق عليه.',
    benefits: [
      {
        title: 'Early plant stress',
        titleAr: 'إجهاد نباتي مبكر',
        description: 'Multispectral indices show condition the eye cannot separate until damage is already done.',
        descriptionAr: 'تُظهر المؤشرات متعددة الأطياف حالة لا تفصلها العين إلا بعد وقوع الضرر.',
      },
      {
        title: 'Coverage at landscape scale',
        titleAr: 'تغطية على نطاق المشهد',
        description: 'Crop areas, mangrove stands, and coastlines mapped in repeatable missions rather than sample walks.',
        descriptionAr: 'رسم مناطق المحاصيل ومواقع المانجروف والسواحل في مهام قابلة للتكرار لا بجولات عينات.',
      },
      {
        title: 'Evidence for compliance',
        titleAr: 'دليل للالتزام',
        description: 'Dated, georeferenced maps that show where change occurred and how it was measured.',
        descriptionAr: 'خرائط مؤرخة ومسندة جغرافياً تُظهر أين حدث التغيّر وكيف قِيس.',
      },
      {
        title: 'Habitat in context',
        titleAr: 'الموطن في سياقه',
        description: 'RGB orthophotos sit beside index maps so a classification can be checked against the ground.',
        descriptionAr: 'ترافق الصور المصححة خرائط المؤشرات حتى يمكن التحقق من التصنيف مقابل الواقع.',
      },
      {
        title: 'Marine and coastal watch',
        titleAr: 'مراقبة بحرية وساحلية',
        description: 'Sediment plumes and shoreline condition monitored without a boat on every pass.',
        descriptionAr: 'مراقبة أعمدة الرواسب وحالة الشاطئ دون قارب في كل مرور.',
      },
      {
        title: 'A baseline you can repeat',
        titleAr: 'خط أساس يمكن تكراره',
        description: 'The mission is designed to be flown again so a season or a project phase can be compared.',
        descriptionAr: 'تُصمم المهمة لتعاد حتى يمكن مقارنة موسم أو مرحلة مشروع.',
      },
    ],
    applications: [
      {
        title: 'Mangrove and coastal vegetation',
        titleAr: 'المانجروف والغطاء الساحلي',
        description: 'NDVI and multispectral orthomosaics for health, extent, and change in coastal planting.',
        descriptionAr: 'مؤشر NDVI وصور مصححة متعددة الأطياف لصحة وامتداد وتغيّر الزراعة الساحلية.',
      },
      {
        title: 'Conservation and habitat programmes',
        titleAr: 'برامج الحفظ والموائل',
        description: 'Wide-area imagery and targeted confirmation for protected species and sensitive shores.',
        descriptionAr: 'صور واسعة وتأكيد موجه للأنواع المحمية والشواطئ الحساسة.',
      },
      {
        title: 'Dredging and marine works',
        titleAr: 'التجريف والأعمال البحرية',
        description: 'Plume density and spread mapped against the containment line during active works.',
        descriptionAr: 'رسم كثافة العكر وانتشاره مقابل خط الاحتواء أثناء الأعمال النشطة.',
      },
      {
        title: 'Environmental impact follow-up',
        titleAr: 'متابعة الأثر البيئي',
        description: 'Repeat layers that show whether vegetation, water, or shoreline condition is shifting.',
        descriptionAr: 'طبقات متكررة تُظهر إن كانت حالة الغطاء أو الماء أو الشاطئ تتغير.',
      },
      {
        title: 'Vegetation cover mapping',
        titleAr: 'رسم الغطاء النباتي',
        description: 'Classified cover for sites where the amount and type of vegetation is part of the record.',
        descriptionAr: 'غطاء مصنَّف للمواقع التي يكون فيها مقدار الغطاء ونوعه جزءاً من السجل.',
      },
      {
        title: 'Coastline surveys',
        titleAr: 'مسوح السواحل',
        description: 'Long-endurance flights over shore and near-shore water that ground teams cannot hold continuously.',
        descriptionAr: 'طلعات طويلة التحمل فوق الشاطئ والمياه القريبة لا تستطيع الفرق الأرضية تغطيتها باستمرار.',
      },
    ],
    technologies: [
      {
        name: 'Five-band multispectral',
        nameAr: 'متعدد الأطياف بخمسة نطاقات',
        description: 'Imagery processed into health indices and georeferenced orthomosaics.',
        descriptionAr: 'صور تُعالج إلى مؤشرات صحة وصور مصححة مسندة جغرافياً.',
      },
      {
        name: 'NDVI health maps',
        nameAr: 'خرائط صحة NDVI',
        description: 'A standard vegetation index delivered as a GeoTIFF for analysis and archive.',
        descriptionAr: 'مؤشر نباتي معياري يُسلَّم كملف GeoTIFF للتحليل والأرشفة.',
      },
      {
        name: 'RGB orthophotos',
        nameAr: 'صور مصححة ملونة',
        description: 'Visual context captured alongside the multispectral pass for validation.',
        descriptionAr: 'سياق بصري يُلتقط مع المرور متعدد الأطياف للتحقق.',
      },
      {
        name: 'Fixed-wing coastal survey',
        nameAr: 'مسح ساحلي ثابت الجناح',
        description: 'Endurance for long shores and near-shore extents in a single mission.',
        descriptionAr: 'تحمل للشواطئ الطويلة والنطاق القريب من الشاطئ في مهمة واحدة.',
      },
      {
        name: 'Sediment index mapping',
        nameAr: 'رسم مؤشر الرواسب',
        description: 'Multispectral maps that flag plume spread beyond a containment line.',
        descriptionAr: 'خرائط متعددة الأطياف تشير إلى انتشار العكر خارج خط الاحتواء.',
      },
      {
        name: 'GIS-ready environmental layers',
        nameAr: 'طبقات بيئية جاهزة لنظم المعلومات',
        description: 'Index maps, orthomosaics, and a method note for the project file.',
        descriptionAr: 'خرائط مؤشرات وصور مصححة ومذكرة منهج لملف المشروع.',
      },
    ],
    faqs: [
      {
        question: 'What environmental conditions can you map?',
        questionAr: 'ما الظروف البيئية التي يمكنكم رسمها؟',
        answer:
          'Vegetation health and cover, mangrove and coastal habitat, shoreline condition, and surface sediment movement around marine works. Each product is a map with a documented method.',
        answerAr:
          'صحة الغطاء وامتداده وموائل المانجروف والساحل وحالة الشاطئ وحركة الرواسب السطحية حول الأعمال البحرية. وكل منتج خريطة بمنهج موثّق.',
      },
      {
        question: 'Why use multispectral imagery instead of a normal photo?',
        questionAr: 'لماذا الصور متعددة الأطياف بدلاً من الصورة العادية؟',
        answer:
          'Plant stress and some surface changes are not obvious in visible light. Extra bands, processed into an index such as NDVI, show condition earlier and more consistently.',
        answerAr:
          'إجهاد النبات وبعض تغيرات السطح غير واضحة في الضوء المرئي. والنطاقات الإضافية، بعد معالجتها إلى مؤشر مثل NDVI، تُظهر الحالة أبكر وبشكل أكثر اتساقاً.',
      },
      {
        question: 'Can you monitor protected coastal species?',
        questionAr: 'هل يمكنكم مراقبة الأنواع الساحلية المحمية؟',
        answer:
          'Wide-area flights can feed detection models and a sighting log, with a closer multirotor pass used to confirm what the overview flight flagged. This supports monitoring; it does not replace a specialist ecological survey.',
        answerAr:
          'يمكن للطلعات الواسعة تغذية نماذج الكشف وسجل المشاهدات، مع مرور أقرب بطائرة متعددة المراوح لتأكيد ما أشارت إليه طلعة النظرة العامة. هذا يدعم المراقبة ولا يستبدل المسح البيئي التخصصي.',
      },
      {
        question: 'How often should monitoring be repeated?',
        questionAr: 'كم مرة ينبغي تكرار المراقبة؟',
        answer:
          'Often enough to match the process you are watching — a growing season, a dredging programme, or a restoration milestone. The flight plan stays stable so dates compare.',
        answerAr:
          'بالوتيرة التي تناسب العملية التي تُراقب — موسم نمو أو برنامج تجريف أو محطة استعادة. وتبقى خطة الطيران ثابتة حتى تتقابل التواريخ.',
      },
      {
        question: 'What do you hand over?',
        questionAr: 'ماذا تسلّمون؟',
        answer:
          'Typically an RGB orthomosaic, a multispectral orthomosaic and NDVI GeoTIFF where vegetation is in scope, plume or shoreline maps for marine work, and a short technical report.',
        answerAr:
          'عادة صورة مصححة ملونة، وصورة مصححة متعددة الأطياف وملف NDVI بصيغة GeoTIFF حين يكون الغطاء ضمن النطاق، وخرائط عكر أو شاطئ للأعمال البحرية، وتقريراً فنياً قصيراً.',
      },
    ],
    ctaTitle: 'Plan an environmental mission',
    ctaTitleAr: 'خطط لمهمة بيئية',
    ctaDescription:
      'Describe the habitat or the works, the question you need answered, and how often it should be repeated. We will propose the sensors and the maps.',
    ctaDescriptionAr:
      'صف الموطن أو الأعمال والسؤال الذي تحتاج إجابته ووتيرة التكرار. سنقترح الحساسات والخرائط.',
    seoTitle: 'Environmental Monitoring | Shamal Technologies',
    seoDescription:
      'Environmental drone monitoring in Saudi Arabia. NDVI, multispectral mapping, coastal habitat, and dredge-plume surveys by Shamal Technologies.',
    seoKeywords:
      'environmental monitoring Saudi Arabia, NDVI drone, mangrove monitoring, coastal survey, multispectral mapping, Shamal Technologies',
  },

  'scan-cad-to-bim': {
    heroTitle: 'A measurable model of the building you have',
    heroTitleAr: 'نموذج قابل للقياس للمبنى القائم',
    heroDescription:
      'Reality capture of interiors and exteriors into high-fidelity 3D models that give BIM, engineering, and facilities teams a reliable base for design and coordination.',
    heroDescriptionAr:
      'التقاط الواقع للداخل والخارج في مجسمات ثلاثية عالية الدقة تمنح فرق نمذجة معلومات البناء والهندسة وإدارة المرافق قاعدة موثوقة للتصميم والتنسيق.',
    overviewTitle: 'One survey for the inside and the outside',
    overviewTitleAr: 'مسح واحد للداخل والخارج',
    overview:
      'Teams lose time when the only record of a facility is a set of drawings that no longer match the building, or a point cloud that still needs someone to stand in every room. Shamal captures interior and exterior together into a high-fidelity 3D model, including Gaussian-splatting representations where that fidelity is what the project needs.\n\nThe model is a base for BIM and engineering coordination: stakeholders can inspect the space remotely, and design teams spend fewer days returning to site to rediscover conditions the first survey already recorded.',
    overviewAr:
      'تخسر الفرق وقتاً حين يكون السجل الوحيد للمنشأة مجموعة مخططات لم تعد تطابق المبنى، أو سحابة نقاط ما زالت تحتاج وقوفاً في كل غرفة. تلتقط شمل الداخل والخارج معاً في مجسم ثلاثي عالي الدقة، بما في ذلك تمثيلات الرش الغاوسي حين تكون تلك الدقة هي ما يحتاجه المشروع.\n\nالنموذج قاعدة لتنسيق نمذجة معلومات البناء والهندسة: يستطيع أصحاب المصلحة فحص الفراغ عن بعد، وتقضي فرق التصميم أياماً أقل في العودة إلى الموقع لإعادة اكتشاف حالة سجلها المسح الأول.',
    benefits: [
      {
        title: 'Interior and exterior together',
        titleAr: 'الداخل والخارج معاً',
        description: 'One capture campaign documents the envelope and the occupied space, not one of them.',
        descriptionAr: 'حملة التقاط واحدة توثّق الغلاف والفراغ المستخدم، لا أحدهما فقط.',
      },
      {
        title: 'A base BIM can trust',
        titleAr: 'قاعدة يمكن لنمذجة معلومات البناء الاعتماد عليها',
        description: 'A visual, measurable model for coordination instead of a drawing set that has drifted from site.',
        descriptionAr: 'نموذج بصري قابل للقياس للتنسيق بدلاً من مجموعة مخططات ابتعدت عن الموقع.',
      },
      {
        title: 'Fewer return visits',
        titleAr: 'زيارات عودة أقل',
        description: 'Planning, inspection, and design questions are answered from the model before anyone travels back.',
        descriptionAr: 'تُجاب أسئلة التخطيط والفحص والتصميم من النموذج قبل أن يسافر أحد مجدداً.',
      },
      {
        title: 'Remote access for the project team',
        titleAr: 'وصول عن بعد لفريق المشروع',
        description: 'Stakeholders review the facility without booking another site walk for context.',
        descriptionAr: 'يراجع أصحاب المصلحة المنشأة دون حجز جولة موقع أخرى من أجل السياق.',
      },
      {
        title: 'Existing drawings put back in context',
        titleAr: 'المخططات القائمة تُعاد إلى سياقها',
        description: 'Scan and CAD information is anchored to what is actually built, so clashes are visible.',
        descriptionAr: 'تُربَط معلومات المسح والتصميم بما هو مبني فعلاً حتى تصبح التعارضات مرئية.',
      },
      {
        title: 'Suited to live facilities',
        titleAr: 'مناسبة للمنشآت العاملة',
        description: 'Capture is planned around operations so the building does not have to be emptied to be documented.',
        descriptionAr: 'يُخطط الالتقاط حول التشغيل حتى لا يلزم إخلاء المبنى لتوثيقه.',
      },
    ],
    applications: [
      {
        title: 'BIM coordination',
        titleAr: 'تنسيق نمذجة معلومات البناء',
        description: 'A current 3D base for design teams coordinating architecture, structure, and services.',
        descriptionAr: 'قاعدة ثلاثية حالية لفرق التصميم التي تنسق العمارة والإنشاء والخدمات.',
      },
      {
        title: 'Industrial and plant documentation',
        titleAr: 'توثيق المصانع والمنشآت',
        description: 'Complex interiors recorded in one model when conventional survey would take repeated visits.',
        descriptionAr: 'تسجيل الدواخل المعقدة في نموذج واحد حين يحتاج المسح التقليدي زيارات متكررة.',
      },
      {
        title: 'Facilities and asset records',
        titleAr: 'سجلات المرافق والأصول',
        description: 'An as-found model for operators who need to know the building they manage, not the one that was drawn.',
        descriptionAr: 'نموذج للوضع القائم للمشغّلين الذين يحتاجون المبنى الذي يديرونه لا الذي رُسم.',
      },
      {
        title: 'Renovation and fit-out',
        titleAr: 'التجديد والتجهيز',
        description: 'Existing conditions captured before design, so new work is coordinated against reality.',
        descriptionAr: 'التقاط الوضع القائم قبل التصميم حتى يُنسَّق العمل الجديد مع الواقع.',
      },
      {
        title: 'Scan to a usable model',
        titleAr: 'من المسح إلى نموذج قابل للاستخدام',
        description: 'Point clouds and reality models prepared as the starting point for CAD and BIM authoring.',
        descriptionAr: 'سحب نقاط ونماذج واقع مهيأة كنقطة بداية لإعداد التصميم ونمذجة معلومات البناء.',
      },
      {
        title: 'Remote design reviews',
        titleAr: 'مراجعات تصميم عن بعد',
        description: 'Immersive visual context for reviewers who cannot all be on site the same day.',
        descriptionAr: 'سياق بصري غامر للمراجعين الذين لا يمكن حضورهم جميعاً إلى الموقع في اليوم نفسه.',
      },
    ],
    technologies: [
      {
        name: 'Mobile reality capture',
        nameAr: 'التقاط واقع متنقل',
        description: 'Handheld and mobile systems for interior routes and exterior envelopes in one campaign.',
        descriptionAr: 'أنظمة محمولة ومتنقلة لمسارات الداخل وغلاف الخارج في حملة واحدة.',
      },
      {
        name: 'Gaussian splatting models',
        nameAr: 'نماذج الرش الغاوسي',
        description: 'High-fidelity visual twins for spaces that need to be inspected, not only measured.',
        descriptionAr: 'توائم بصرية عالية الدقة للفراغات التي تحتاج فحصاً لا قياساً فقط.',
      },
      {
        name: 'Point clouds',
        nameAr: 'سحب النقاط',
        description: 'Measurable geometry for sections, clearances, and model authoring.',
        descriptionAr: 'هندسة قابلة للقياس للقطاعات والخلوصات وإعداد النموذج.',
      },
      {
        name: 'Textured 3D mesh',
        nameAr: 'مجسم ثلاثي بنسيج',
        description: 'A navigable model of the facility for coordination meetings.',
        descriptionAr: 'نموذج قابل للتجول للمنشأة في اجتماعات التنسيق.',
      },
      {
        name: 'CAD alignment',
        nameAr: 'مطابقة التصميم بالحاسوب',
        description: 'Existing drawings checked against the captured condition so gaps are explicit.',
        descriptionAr: 'فحص المخططات القائمة مقابل الوضع الملتقط حتى تكون الفجوات صريحة.',
      },
      {
        name: 'BIM-ready handover',
        nameAr: 'تسليم جاهز لنمذجة معلومات البناء',
        description: 'Models and supporting files issued with the coordinate and capture notes the authoring team needs.',
        descriptionAr: 'نماذج وملفات داعمة تُسلَّم مع ملاحظات الإحداثيات والالتقاط التي يحتاجها فريق الإعداد.',
      },
    ],
    faqs: [
      {
        question: 'Do you deliver a finished BIM model?',
        questionAr: 'هل تسلّمون نموذج نمذجة معلومات بناء مكتمل؟',
        answer:
          'We deliver the reality-capture base: point clouds, meshes, and high-fidelity visual models, aligned so BIM and CAD teams can author from what was captured. The authoring scope is agreed separately if you need modelled elements as well as the scan.',
        answerAr:
          'نسلّم قاعدة التقاط الواقع: سحب نقاط ومجسمات ونماذج بصرية عالية الدقة، مطابقة حتى تستطيع فرق نمذجة معلومات البناء والتصميم الإعداد مما التُقط. ويُتفق على نطاق الإعداد بشكل منفصل إذا كنتم تحتاجون عناصر منمذجة إضافة إلى المسح.',
      },
      {
        question: 'Can you capture occupied buildings?',
        questionAr: 'هل يمكنكم الالتقاط في مبانٍ مشغولة؟',
        answer:
          'Yes. Routes are planned around operations. Interior and exterior can be covered in the same campaign so the model is one facility, not two disconnected surveys.',
        answerAr:
          'نعم. تُخطط المسارات حول التشغيل. ويمكن تغطية الداخل والخارج في الحملة نفسها حتى يكون النموذج منشأة واحدة لا مسحين منفصلين.',
      },
      {
        question: 'What is Gaussian splatting used for?',
        questionAr: 'فيم يُستخدم الرش الغاوسي؟',
        answer:
          'It produces a high-fidelity visual twin of complex spaces, so reviewers can inspect surfaces and context remotely. Measurement still relies on the point cloud and survey control captured alongside it.',
        answerAr:
          'ينتج توأماً بصرياً عالي الدقة للفراغات المعقدة، فيستطيع المراجعون فحص الأسطح والسياق عن بعد. ويبقى القياس معتمداً على سحابة النقاط وضبط المسح الملتقط معها.',
      },
      {
        question: 'How does this reduce site visits?',
        questionAr: 'كيف يقلل ذلك زيارات الموقع؟',
        answer:
          'Once the model exists, coordination questions that used to require another walk — clashes, access, what is actually installed — are reviewed from the twin first.',
        answerAr:
          'بعد وجود النموذج، تُراجع أولاً من التوأم أسئلة التنسيق التي كانت تحتاج جولة أخرى: التعارضات والوصول وما هو مركّب فعلاً.',
      },
      {
        question: 'Which facilities is this suited to?',
        questionAr: 'ما المنشآت المناسبة لذلك؟',
        answer:
          'Industrial plants, commercial buildings, facilities undergoing renovation, and any site where drawings and the built condition have diverged.',
        answerAr:
          'المصانع والمباني التجارية والمنشآت قيد التجديد وأي موقع افترقت فيه المخططات عن الوضع المبني.',
      },
    ],
    ctaTitle: 'Scope a reality-capture survey',
    ctaTitleAr: 'حدد نطاق مسح التقاط الواقع',
    ctaDescription:
      'Tell us the facility, whether you need interior, exterior, or both, and what your BIM team will author from the model.',
    ctaDescriptionAr:
      'أخبرنا بالمنشأة وما إذا كنتم تحتاجون الداخل أو الخارج أو كليهما، وما الذي سيعدّه فريق نمذجة معلومات البناء من النموذج.',
    seoTitle: 'SCAN/CAD to BIM | Shamal Technologies',
    seoDescription:
      'Reality capture and scan-to-BIM support in Saudi Arabia. Interior and exterior 3D models, point clouds, and BIM-ready survey bases from Shamal Technologies.',
    seoKeywords:
      'scan to BIM Saudi Arabia, reality capture, point cloud, digital twin, Gaussian splatting, CAD to BIM, Shamal Technologies',
  },

  'mining-exploration': {
    heroTitle: 'Wide ground, read as a map',
    heroTitleAr: 'أرض واسعة تُقرأ كخريطة',
    heroDescription:
      'Large-area mapping and AI-assisted interpretation for mines and exploration ground — inventories, land cover, encroachment, and GIS layers across sites that are too big to walk.',
    heroDescriptionAr:
      'رسم المساحات الواسعة وتفسير مدعوم بالذكاء الاصطناعي للمناجم وأراضي الاستكشاف: حصر وغطاء أرضي وتعدٍّ وطبقات نظم معلومات لمواقع أكبر من أن تُمشى.',
    overviewTitle: 'Many sites, one consistent reading',
    overviewTitleAr: 'مواقع كثيرة وقراءة واحدة متسقة',
    overview:
      'Mining ground does not fit a single walkover. Shamal maps large areas and multi-site programmes into orthomosaics, then applies classification to extract what operations need to see: assets, waste, vegetation, water, crusher and plant areas, buildings, and vehicles.\n\nThe same capability supports exploration context and perimeter control. Wide boundaries that ground patrols cannot cover often enough are flown on a repeat plan, so encroachment is a detection with a location, not a suspicion at the end of a shift.',
    overviewAr:
      'لا تناسب أرض التعدين جولة واحدة. ترسم شمل المساحات الواسعة وبرامج المواقع المتعددة في صور مصححة، ثم تطبّق التصنيف لاستخراج ما تحتاج العمليات رؤيته: الأصول والمخلفات والغطاء النباتي والماء ومناطق الكسارات والمعمل والمباني والمركبات.\n\nوتدعم القدرة نفسها سياق الاستكشاف وضبط المحيط. تُحلَّق الحدود الواسعة التي لا تستطيع الدوريات الأرضية تغطيتها بالقدر الكافي وفق خطة متكررة، فيصبح التعدي كشفاً بموقع لا ظناً في نهاية الوردية.',
    benefits: [
      {
        title: 'Area that foot survey cannot hold',
        titleAr: 'مساحة لا يثبتها المسح سيراً',
        description: 'Orthomosaic coverage across wide leases and multi-site programmes under one method.',
        descriptionAr: 'تغطية بصور مصححة لامتيازات واسعة وبرامج متعددة المواقع بمنهج واحد.',
      },
      {
        title: 'Features extracted, not only pictured',
        titleAr: 'معالم تُستخرج لا تُصوَّر فقط',
        description: 'AI classification turns the mosaic into layers: assets, vegetation, water, waste, and structures.',
        descriptionAr: 'يحوّل التصنيف بالذكاء الاصطناعي الصورة إلى طبقات: أصول وغطاء وماء ومخلفات ومنشآت.',
      },
      {
        title: 'An inventory you can query',
        titleAr: 'حصر يمكن الاستعلام عنه',
        description: 'Detected features delivered as GIS layers, with an assessment of detection quality.',
        descriptionAr: 'معالم مكتشفة تُسلَّم كطبقات نظم معلومات مع تقييم لجودة الكشف.',
      },
      {
        title: 'Encroachment seen earlier',
        titleAr: 'التعدي يُرى أبكر',
        description: 'Repeat coverage of long perimeters so activity is flagged between patrols, not after it.',
        descriptionAr: 'تغطية متكررة للمحيطات الطويلة حتى يُشار إلى النشاط بين الدوريات لا بعدها.',
      },
      {
        title: 'Vegetation and water in the same view',
        titleAr: 'الغطاء والماء في المشهد نفسه',
        description: 'Environmental context mapped with the operational picture, not as a separate study.',
        descriptionAr: 'يُرسم السياق البيئي مع الصورة التشغيلية لا كدراسة منفصلة.',
      },
      {
        title: 'One programme, many sites',
        titleAr: 'برنامج واحد ومواقع عديدة',
        description: 'A consistent capture and classification specification so sites can be compared.',
        descriptionAr: 'مواصفة التقاط وتصنيف ثابتة حتى يمكن مقارنة المواقع.',
      },
    ],
    applications: [
      {
        title: 'Mine-site basemaps',
        titleAr: 'خرائط أساس لمواقع التعدين',
        description: 'Current orthomosaics of pits, plants, dumps, and access for planning and reporting.',
        descriptionAr: 'صور مصححة حالية للحفر والمعامل والمكبات والمداخل للتخطيط والتقارير.',
      },
      {
        title: 'Asset and land-cover inventory',
        titleAr: 'حصر الأصول والغطاء الأرضي',
        description: 'Automated extraction of structures, vehicles, vegetation, water, waste, and work areas.',
        descriptionAr: 'استخراج آلي للمنشآت والمركبات والغطاء والماء والمخلفات ومناطق العمل.',
      },
      {
        title: 'Exploration context',
        titleAr: 'سياق الاستكشاف',
        description: 'Wide-area terrain and surface mapping before and during field programmes.',
        descriptionAr: 'رسم تضاريس وسطح على مساحة واسعة قبل برامج الميدان وأثناءها.',
      },
      {
        title: 'Perimeter encroachment',
        titleAr: 'التعدي على المحيط',
        description: 'Repeat flights along long boundaries where a ground vehicle arrives too late.',
        descriptionAr: 'طلعات متكررة على الحدود الطويلة حيث تصل المركبة الأرضية متأخرة.',
      },
      {
        title: 'Environmental compliance on site',
        titleAr: 'الالتزام البيئي في الموقع',
        description: 'Vegetation cover and water bodies mapped against the operational footprint.',
        descriptionAr: 'رسم الغطاء النباتي والمسطحات المائية مقابل البصمة التشغيلية.',
      },
      {
        title: 'Multi-site programmes',
        titleAr: 'برامج متعددة المواقع',
        description: 'The same specification applied across a portfolio so management sees one standard of evidence.',
        descriptionAr: 'تطبيق المواصفة نفسها على محفظة مواقع حتى ترى الإدارة معياراً واحداً من الأدلة.',
      },
    ],
    technologies: [
      {
        name: 'Large-area orthomosaics',
        nameAr: 'صور مصححة للمساحات الواسعة',
        description: 'Georeferenced basemaps covering leases measured in square kilometres.',
        descriptionAr: 'خرائط أساس مسندة جغرافياً تغطي امتيازات تُقاس بالكيلومترات المربعة.',
      },
      {
        name: 'AI feature extraction',
        nameAr: 'استخراج المعالم بالذكاء الاصطناعي',
        description: 'Models trained to detect and classify mining and environmental features on the mosaic.',
        descriptionAr: 'نماذج مدرَّبة لكشف وتصنيف المعالم التعدينية والبيئية على الصورة المصححة.',
      },
      {
        name: 'GIS inventory layers',
        nameAr: 'طبقات حصر نظم المعلومات',
        description: 'Detected objects delivered as layers, not as marks on a picture.',
        descriptionAr: 'أجسام مكتشفة تُسلَّم كطبقات لا كعلامات على صورة.',
      },
      {
        name: 'Vegetation and water analysis',
        nameAr: 'تحليل الغطاء والماء',
        description: 'Cover and water mapping included in the same classification pass.',
        descriptionAr: 'رسم الغطاء والماء ضمن مرور التصنيف نفسه.',
      },
      {
        name: 'Repeat perimeter missions',
        nameAr: 'مهام محيط متكررة',
        description: 'Scheduled flights for boundaries that change faster than a ground patrol can see.',
        descriptionAr: 'طلعات مجدولة للحدود التي تتغير أسرع مما تراه دورية أرضية.',
      },
      {
        name: 'Accuracy assessment',
        nameAr: 'تقييم الدقة',
        description: 'Detection quality reviewed and reported with the inventory, not assumed.',
        descriptionAr: 'تُراجع جودة الكشف وتُذكر مع الحصر ولا تُفترض.',
      },
    ],
    faqs: [
      {
        question: 'How large an area can one programme cover?',
        questionAr: 'ما المساحة التي يمكن أن يغطيها برنامج واحد؟',
        answer:
          'Programmes are scoped across multiple sites and areas measured in hundreds of square kilometres when the aircraft and the processing specification are set for area, not for a single pit.',
        answerAr:
          'تُحدد البرامج عبر مواقع متعددة ومساحات تُقاس بمئات الكيلومترات المربعة حين تُضبط الطائرة ومواصفة المعالجة للمساحة لا لحفرة واحدة.',
      },
      {
        question: 'What can the classification detect?',
        questionAr: 'ماذا يستطيع التصنيف كشفه؟',
        answer:
          'Depending on the model and the imagery: mining assets, waste, vegetation, water, crusher and plant areas, buildings, vehicles, and habitation. The class list is agreed before training and checked afterwards.',
        answerAr:
          'حسب النموذج والصور: أصول التعدين والمخلفات والغطاء والماء ومناطق الكسارة والمعمل والمباني والمركبات ومناطق السكن. وتُتفق قائمة الفئات قبل التدريب وتُراجع بعده.',
      },
      {
        question: 'Is this a replacement for a geological survey?',
        questionAr: 'هل هذا بديل عن المسح الجيولوجي؟',
        answer:
          'No. It is surface mapping, inventory, and monitoring. It gives exploration and operations teams a current spatial picture. Subsurface geology remains a separate discipline.',
        answerAr:
          'لا. هو رسم سطح وحصر ومراقبة. يمنح فرق الاستكشاف والعمليات صورة مكانية حالية. وتبقى جيولوجيا ما تحت السطح تخصصاً مستقلاً.',
      },
      {
        question: 'Can you watch a long site boundary?',
        questionAr: 'هل يمكنكم مراقبة حد موقع طويل؟',
        answer:
          'Yes. Repeat and autonomous patrol patterns are used on perimeters that are too long for a ground crew to cover before an intrusion has moved on.',
        answerAr:
          'نعم. تُستخدم أنماط دورية متكررة وذاتية على المحيطات التي تطول على طاقم أرضي قبل أن يتحرك التسلل.',
      },
      {
        question: 'What is delivered?',
        questionAr: 'ماذا يُسلَّم؟',
        answer:
          'Orthomosaics, GIS layers for detected features, vegetation and related cover analysis, an inventory, a detection-quality note, and the method used to produce them.',
        answerAr:
          'صور مصححة وطبقات نظم معلومات للمعالم المكتشفة وتحليل الغطاء وما يتصل به وحصر ومذكرة جودة الكشف والمنهج المستخدم لإنتاجها.',
      },
    ],
    ctaTitle: 'Map a mining programme',
    ctaTitleAr: 'ارسم برنامج تعدين',
    ctaDescription:
      'Share the sites, the features you need extracted, and whether the priority is inventory, environment, or the boundary. We will propose the capture and the model.',
    ctaDescriptionAr:
      'شارك المواقع والمعالم التي تحتاج استخراجها وما إذا كانت الأولوية الحصر أو البيئة أو الحد. سنقترح الالتقاط والنموذج.',
    seoTitle: 'Mining & Exploration | Shamal Technologies',
    seoDescription:
      'Mining and exploration mapping in Saudi Arabia. Large-area orthomosaics, AI feature extraction, and GIS inventories from Shamal Technologies.',
    seoKeywords:
      'mining survey Saudi Arabia, exploration mapping, mine orthomosaic, AI classification, encroachment monitoring, Shamal Technologies',
  },

  'security-surveillance': {
    heroTitle: 'A patrol that does not wait for the shift',
    heroTitleAr: 'دورية لا تنتظر الوردية',
    heroDescription:
      'Autonomous aerial patrols for perimeters, industrial sites, and remote boundaries — thermal and visual detection streamed to the control room, day and night.',
    heroDescriptionAr:
      'دوريات جوية ذاتية للمحيطات والمواقع الصناعية والحدود النائية: كشف حراري وبصري يُبث إلى غرفة التحكم ليلاً ونهاراً.',
    overviewTitle: 'The control room sees it before the ground team drives',
    overviewTitleAr: 'غرفة التحكم تراها قبل أن تتحرك الفرق الأرضية',
    overview:
      'Long fences and remote industrial sites leave gaps that a vehicle patrol cannot close. Intruders see the patrol coming. Shamal deploys autonomous aircraft, including dock-based systems, on pre-programmed routes with dual thermal and RGB sensors. Edge analytics classify people and vehicles in real time, and the control room intervenes when there is a detection — then directs the ground team to a point, not along the whole fence.\n\nThe same pattern supports site safety: scheduled day and night routes can flag workers, helmets, and vehicles so hazards are a snapshot with a location, not a missed observation.',
    overviewAr:
      'تترك الأسوار الطويلة والمواقع الصناعية النائية فجوات لا تغلقها دورية مركبة. ويرى المتسللون الدورية قادمة. تنشر شمل طائرات ذاتية، بما فيها أنظمة الإرساء، على مسارات مبرمجة مسبقاً بحساسات حرارية وبصرية مزدوجة. وتصنف تحليلات الحافة الأشخاص والمركبات لحظياً، وتتدخل غرفة التحكم عند وجود كشف — ثم توجّه الفريق الأرضي إلى نقطة لا على طول السور كله.\n\nويدعم النمط نفسه سلامة الموقع: مسارات مجدولة ليلاً ونهاراً يمكنها الإشارة إلى العمال والخوذ والمركبات حتى يكون الخطر لقطة بموقع لا ملاحظة فائتة.',
    benefits: [
      {
        title: 'Coverage without a permanent crew on the fence',
        titleAr: 'تغطية دون طاقم دائم على السور',
        description: 'Autonomous sorties run the route. People respond to detections, not to the whole patrol.',
        descriptionAr: 'تنفذ الطلعات الذاتية المسار. ويستجيب الأشخاص للكشف لا للدورية كلها.',
      },
      {
        title: 'Thermal and visual together',
        titleAr: 'الحراري والبصري معاً',
        description: 'Night and low-visibility breaches are classified, not just recorded as a heat blob.',
        descriptionAr: 'تُصنَّف الاختراقات ليلاً وفي ضعف الرؤية ولا تُسجل كبقعة حرارة فقط.',
      },
      {
        title: 'Live to the control room',
        titleAr: 'مباشر إلى غرفة التحكم',
        description: 'Routes stream to operators so a detection becomes a directed response.',
        descriptionAr: 'تُبث المسارات للمشغّلين حتى يتحول الكشف إلى استجابة موجهة.',
      },
      {
        title: 'Day and night on one plan',
        titleAr: 'ليل ونهار في خطة واحدة',
        description: 'The same dock and route logic runs after dark, when a ground patrol is slowest.',
        descriptionAr: 'يعمل منطق الإرساء والمسار نفسه بعد حلول الظلام حين تكون الدورية الأرضية في أبطأ حالاتها.',
      },
      {
        title: 'Fewer blind sections',
        titleAr: 'مقاطع عمياء أقل',
        description: 'Long perimeters are swept on every sortie instead of sampled when a vehicle happens to pass.',
        descriptionAr: 'تُمسح المحيطات الطويلة في كل طلعة بدلاً من أخذ عينة حين تمر مركبة.',
      },
      {
        title: 'Safety as well as security',
        titleAr: 'سلامة وأمن معاً',
        description: 'Detection can include workers, helmets, and vehicles for sites that need both watch-keeping duties.',
        descriptionAr: 'يمكن أن يشمل الكشف العمال والخوذ والمركبات في المواقع التي تحتاج المهمتين.',
      },
    ],
    applications: [
      {
        title: 'Industrial perimeters',
        titleAr: 'محيطات صناعية',
        description: 'Fencelines too long for a ground crew to cover before an intrusion has cleared the area.',
        descriptionAr: 'خطوط أسوار أطول من أن يغطيها طاقم أرضي قبل أن يخلو مكان التسلل.',
      },
      {
        title: 'Remote boundaries',
        titleAr: 'حدود نائية',
        description: 'Sites far from the office, watched on a schedule instead of when someone can travel there.',
        descriptionAr: 'مواقع بعيدة عن المكتب تُراقب وفق جدول لا حين يستطيع أحد السفر إليها.',
      },
      {
        title: 'Border and wide-area patrol',
        titleAr: 'دورية الحدود والمساحات الواسعة',
        description: 'Autonomous thermal and RGB patrols that remove the blind gaps in a manual line.',
        descriptionAr: 'دوريات حرارية وبصرية ذاتية تزيل الفجوات العمياء في الخط اليدوي.',
      },
      {
        title: 'Construction and plant safety',
        titleAr: 'سلامة الإنشاء والمعمل',
        description: 'Scheduled routes that flag people, helmets, and vehicles for the site control room.',
        descriptionAr: 'مسارات مجدولة تشير إلى الأشخاص والخوذ والمركبات لغرفة تحكم الموقع.',
      },
      {
        title: 'Critical facilities',
        titleAr: 'المنشآت الحساسة',
        description: 'Repeatable aerial watch over assets where a missed hour is an operational risk.',
        descriptionAr: 'مراقبة جوية قابلة للتكرار على أصول يكون فيها تفويت ساعة خطراً تشغيلياً.',
      },
      {
        title: 'Event and temporary perimeters',
        titleAr: 'محيطات الفعاليات والمحيطات المؤقتة',
        description: 'A planned aerial patrol added for a defined period without building a permanent ground pattern.',
        descriptionAr: 'دورية جوية مخططة تُضاف لمدة محددة دون بناء نمط أرضي دائم.',
      },
    ],
    technologies: [
      {
        name: 'Autonomous dock systems',
        nameAr: 'أنظمة إرساء ذاتية',
        description: 'Scheduled sorties with no operator input until a detection needs a decision.',
        descriptionAr: 'طلعات مجدولة دون تدخل مشغّل إلى أن يحتاج كشف إلى قرار.',
      },
      {
        name: 'Dual thermal and RGB',
        nameAr: 'حراري وبصري مزدوج',
        description: 'Both sensors on the patrol so classification works after dark.',
        descriptionAr: 'الحساسان على الدورية حتى يعمل التصنيف بعد الظلام.',
      },
      {
        name: 'Edge AI analytics',
        nameAr: 'تحليلات ذكاء اصطناعي على الحافة',
        description: 'People and vehicles classified on the aircraft or at the site, in real time.',
        descriptionAr: 'تصنيف الأشخاص والمركبات على الطائرة أو في الموقع لحظياً.',
      },
      {
        name: 'Control-room streaming',
        nameAr: 'بث غرفة التحكم',
        description: 'Live video and detections to the operators who dispatch the ground response.',
        descriptionAr: 'فيديو مباشر وكشوفات للمشغّلين الذين يوجهون الاستجابة الأرضية.',
      },
      {
        name: 'PPE and activity detection',
        nameAr: 'كشف معدات الوقاية والنشاط',
        description: 'Worker, helmet, and vehicle classes for safety patrols on active sites.',
        descriptionAr: 'فئات العامل والخوذة والمركبة لدوريات السلامة في المواقع النشطة.',
      },
      {
        name: 'Programmed route libraries',
        nameAr: 'مكتبات مسارات مبرمجة',
        description: 'Repeatable paths so every sortie covers the boundary you specified.',
        descriptionAr: 'مسارات قابلة للتكرار حتى تغطي كل طلعة الحد الذي حددتموه.',
      },
    ],
    faqs: [
      {
        question: 'Does someone have to fly every patrol?',
        questionAr: 'هل يجب أن يقود شخص كل دورية؟',
        answer:
          'No. Dock-based missions fly pre-programmed routes on a schedule. Operators step in when analytics raise a detection, or when a manual confirmation flight is required.',
        answerAr:
          'لا. تطير مهام الإرساء مسارات مبرمجة وفق جدول. ويتدخل المشغّلون حين ترفع التحليلات كشفاً أو حين يلزم تأكيد يدوي.',
      },
      {
        question: 'What can the system detect?',
        questionAr: 'ماذا يستطيع النظام كشفه؟',
        answer:
          'Typical classes are people and vehicles on security patrols, and workers, helmets, and vehicles on safety patrols. The class list is confirmed for the site before operations start.',
        answerAr:
          'الفئات المعتادة هي الأشخاص والمركبات في الدوريات الأمنية، والعمال والخوذ والمركبات في دوريات السلامة. وتُؤكد قائمة الفئات للموقع قبل بدء التشغيل.',
      },
      {
        question: 'Does it work at night?',
        questionAr: 'هل يعمل ليلاً؟',
        answer:
          'Yes. Thermal sensors are part of the patrol specifically so a breach is not invisible after dark. Routes can be scheduled around the clock.',
        answerAr:
          'نعم. الحساسات الحرارية جزء من الدورية حتى لا يكون الاختراق غير مرئي بعد الظلام. ويمكن جدولة المسارات على مدار الساعة.',
      },
      {
        question: 'Will this replace our ground security team?',
        questionAr: 'هل يلغي ذلك فريق الأمن الأرضي؟',
        answer:
          'It changes what they do. The aircraft covers the route. The ground team is dispatched to a detection instead of spending the shift searching the fence.',
        answerAr:
          'يغيّر ما يفعلونه. تغطي الطائرة المسار. ويُوجَّه الفريق الأرضي إلى كشف بدلاً من قضاء الوردية في البحث على السور.',
      },
      {
        question: 'How is the operation kept compliant?',
        questionAr: 'كيف يبقى التشغيل ملتزماً؟',
        answer:
          'Flights are planned with the required approvals, a method statement, geofenced routes, and site safety rules. Surveillance scope is agreed with the client and limited to the operational area.',
        answerAr:
          'تُخطط الطلعات مع التصاريح اللازمة وبيان الطريقة ومسارات محددة جغرافياً وقواعد سلامة الموقع. ويُتفق على نطاق المراقبة مع العميل ويُحصر في المنطقة التشغيلية.',
      },
    ],
    ctaTitle: 'Design a patrol programme',
    ctaTitleAr: 'صمم برنامج دورية',
    ctaDescription:
      'Share the boundary length, the hours you need covered, and whether the priority is intrusion, safety, or both. We will propose the aircraft and the control-room workflow.',
    ctaDescriptionAr:
      'شارك طول الحد والساعات التي تحتاج تغطيتها وما إذا كانت الأولوية التسلل أو السلامة أو كليهما. سنقترح الطائرة ومسار عمل غرفة التحكم.',
    seoTitle: 'Security Surveillance | Shamal Technologies',
    seoDescription:
      'Aerial security surveillance in Saudi Arabia. Autonomous thermal and visual patrols, perimeter monitoring, and control-room detection from Shamal Technologies.',
    seoKeywords:
      'drone security Saudi Arabia, perimeter surveillance, thermal patrol, autonomous dock, industrial site monitoring, Shamal Technologies',
  },

  'ai-application-development': {
    heroTitle: 'Aerial data, turned into a decision',
    heroTitleAr: 'بيانات جوية تتحول إلى قرار',
    heroDescription:
      'Custom detection, classification, and geospatial AI trained on your imagery — orthomosaics, patrol video, and field data converted into layers and alerts your team can use.',
    heroDescriptionAr:
      'كشف وتصنيف وذكاء اصطناعي جغرافي مخصص يُدرَّب على صورك: صور مصححة وفيديو دوريات وبيانات ميدانية تتحول إلى طبقات وتنبيهات يستخدمها فريقك.',
    overviewTitle: 'Models built for the site, not a generic demo',
    overviewTitleAr: 'نماذج تُبنى للموقع لا لعرض عام',
    overview:
      'Shamal develops AI around aerial operations we already fly. That includes feature extraction on orthomosaics, real-time classification of people and vehicles at the edge, safety detection such as helmets, congestion and density analysis from traffic video, and detection models for environmental monitoring.\n\nA useful model is not a slideshow. We define the classes, train and assess accuracy, and deliver the result as GIS layers, a detection log, or an alert in the workflow your operators already watch.',
    overviewAr:
      'تطوّر شمل الذكاء الاصطناعي حول العمليات الجوية التي نطيرها أصلاً. يشمل ذلك استخراج المعالم من الصور المصححة، والتصنيف اللحظي للأشخاص والمركبات على الحافة، وكشف السلامة مثل الخوذ، وتحليل الازدحام والكثافة من فيديو المرور، ونماذج الكشف للمراقبة البيئية.\n\nالنموذج المفيد ليس عرضاً. نحدد الفئات وندرّب ونقيّم الدقة ونسلّم النتيجة كطبقات نظم معلومات أو سجل كشف أو تنبيه في مسار العمل الذي يراقبه المشغّلون.',
    benefits: [
      {
        title: 'Trained on your operational imagery',
        titleAr: 'مدرَّب على صورك التشغيلية',
        description: 'Classes and thresholds set for the site and the sensor, then checked against real captures.',
        descriptionAr: 'تُضبط الفئات والعتبات للموقع والحساس ثم تُراجع مقابل لقطات حقيقية.',
      },
      {
        title: 'From pixels to layers',
        titleAr: 'من البكسل إلى الطبقات',
        description: 'Detections exported as GIS features, counts, or logs — not left inside a viewing tool.',
        descriptionAr: 'تُصدَّر الكشوفات كمعالم نظم معلومات أو أعداد أو سجلات لا تُترك داخل أداة عرض.',
      },
      {
        title: 'Edge and office analytics',
        titleAr: 'تحليلات على الحافة وفي المكتب',
        description: 'Real-time classification on patrol aircraft, and deeper extraction on orthomosaics after landing.',
        descriptionAr: 'تصنيف لحظي على طائرات الدورية، واستخراج أعمق على الصور المصححة بعد الهبوط.',
      },
      {
        title: 'Accuracy is part of the delivery',
        titleAr: 'الدقة جزء من التسليم',
        description: 'Detection quality is assessed and reported so you know what the model is reliable for.',
        descriptionAr: 'تُقيَّم جودة الكشف وتُذكر حتى تعرف فيم يكون النموذج موثوقاً.',
      },
      {
        title: 'Tied to a field operation',
        titleAr: 'مرتبط بعملية ميدانية',
        description: 'The team that builds the model can also plan the flights that keep it supplied with data.',
        descriptionAr: 'الفريق الذي يبني النموذج يستطيع أيضاً تخطيط الطلعات التي تغذيه بالبيانات.',
      },
      {
        title: 'Workflow integration',
        titleAr: 'دمج في مسار العمل',
        description: 'Outputs shaped for dashboards, GIS, or a control-room alert rather than a one-off file.',
        descriptionAr: 'مخرجات تُشكَّل للوحات أو نظم المعلومات أو تنبيه غرفة التحكم لا لملف لمرة واحدة.',
      },
    ],
    applications: [
      {
        title: 'Orthomosaic feature extraction',
        titleAr: 'استخراج المعالم من الصور المصححة',
        description: 'Assets, vegetation, water, buildings, waste, and vehicles classified across large mapped areas.',
        descriptionAr: 'تصنيف الأصول والغطاء والماء والمباني والمخلفات والمركبات عبر مساحات مرسومة واسعة.',
      },
      {
        title: 'Security and safety detection',
        titleAr: 'كشف الأمن والسلامة',
        description: 'People, vehicles, workers, and helmets flagged on autonomous or scheduled patrols.',
        descriptionAr: 'الإشارة إلى الأشخاص والمركبات والعمال والخوذ في الدوريات الذاتية أو المجدولة.',
      },
      {
        title: 'Traffic and movement analytics',
        titleAr: 'تحليلات المرور والحركة',
        description: 'Density, congestion hotspots, and velocity patterns derived from aerial video.',
        descriptionAr: 'الكثافة ونقاط الازدحام وأنماط السرعة المستمدة من الفيديو الجوي.',
      },
      {
        title: 'Environmental detection',
        titleAr: 'الكشف البيئي',
        description: 'Models that flag habitat features or species indicators across coastline and vegetation surveys.',
        descriptionAr: 'نماذج تشير إلى معالم الموائل أو مؤشرات الأنواع عبر مسوح السواحل والغطاء.',
      },
      {
        title: 'Change and inventory updates',
        titleAr: 'تحديث التغيّر والحصر',
        description: 'Repeat imagery run through the same model so the inventory moves with the site.',
        descriptionAr: 'تشغيل الصور المتكررة عبر النموذج نفسه حتى يتحرك الحصر مع الموقع.',
      },
      {
        title: 'Proof-of-concept deployments',
        titleAr: 'تجارب إثبات المفهوم',
        description: 'A bounded pilot: defined classes, a test area, an accuracy review, and a decision on scale-up.',
        descriptionAr: 'تجربة محدودة: فئات محددة ومنطقة اختبار ومراجعة دقة وقرار بالتوسع.',
      },
    ],
    technologies: [
      {
        name: 'Custom detection models',
        nameAr: 'نماذج كشف مخصصة',
        description: 'Training and evaluation for the object classes your operation actually needs.',
        descriptionAr: 'تدريب وتقييم لفئات الأجسام التي تحتاجها عمليتكم فعلاً.',
      },
      {
        name: 'Orthomosaic analytics',
        nameAr: 'تحليلات الصور المصححة',
        description: 'Automated extraction across wide mapped areas, delivered as GIS layers.',
        descriptionAr: 'استخراج آلي عبر المساحات المرسومة الواسعة ويُسلَّم كطبقات نظم معلومات.',
      },
      {
        name: 'Edge analytics',
        nameAr: 'تحليلات الحافة',
        description: 'On-patrol classification for security and safety routes that cannot wait for the office.',
        descriptionAr: 'تصنيف أثناء الدورية لمسارات الأمن والسلامة التي لا تنتظر المكتب.',
      },
      {
        name: 'GeoAI and heatmaps',
        nameAr: 'الذكاء الاصطناعي الجغرافي وخرائط الحرارة',
        description: 'Spatial density and pattern products from video and repeat imagery.',
        descriptionAr: 'منتجات كثافة وأنماط مكانية من الفيديو والصور المتكررة.',
      },
      {
        name: 'Accuracy assessment',
        nameAr: 'تقييم الدقة',
        description: 'A reported check of what the model detected, missed, and should not be trusted for.',
        descriptionAr: 'فحص موثَّق لما كشفه النموذج وما فاته وما لا ينبغي الوثوق به فيه.',
      },
      {
        name: 'Integration-ready outputs',
        nameAr: 'مخرجات جاهزة للدمج',
        description: 'Layers, logs, and alerts shaped for GIS, dashboards, and control rooms.',
        descriptionAr: 'طبقات وسجلات وتنبيهات مهيأة لنظم المعلومات ولوحات المتابعة وغرف التحكم.',
      },
    ],
    faqs: [
      {
        question: 'What kinds of AI applications do you build?',
        questionAr: 'ما أنواع تطبيقات الذكاء الاصطناعي التي تبنونها؟',
        answer:
          'Detection and classification on aerial imagery and video: site inventories, security and safety classes, traffic density and congestion, and environmental indicators. Each model is scoped to a defined set of classes.',
        answerAr:
          'الكشف والتصنيف على الصور والفيديو الجوي: حصر المواقع وفئات الأمن والسلامة وكثافة المرور والازدحام والمؤشرات البيئية. ويُحدد كل نموذج لمجموعة فئات واضحة.',
      },
      {
        question: 'Do you need our data to start?',
        questionAr: 'هل تحتاجون بياناتنا للبدء؟',
        answer:
          'We can start from imagery we capture for you, from data you already hold, or from a short pilot flight designed to collect a training set. The source is agreed in the scope.',
        answerAr:
          'يمكن البدء من صور نلتقطها لكم أو من بيانات لديكم أو من طلعة تجريبية قصيرة لجمع مجموعة تدريب. ويُتفق على المصدر ضمن النطاق.',
      },
      {
        question: 'How do you show that a model works?',
        questionAr: 'كيف تُثبتون أن النموذج يعمل؟',
        answer:
          'With an accuracy assessment against reviewed samples, delivered with the layers or the detection log. You see what it is reliable for before it is put into an operation.',
        answerAr:
          'بتقييم دقة مقابل عينات مراجعة، يُسلَّم مع الطبقات أو سجل الكشف. وترون فيم هو موثوق قبل إدخاله في التشغيل.',
      },
      {
        question: 'Can detections run during a live patrol?',
        questionAr: 'هل يمكن أن يعمل الكشف أثناء دورية مباشرة؟',
        answer:
          'Yes, for classes suited to edge analytics, such as people, vehicles, and safety gear. Wider orthomosaic extraction is processed after capture.',
        answerAr:
          'نعم للفئات المناسبة لتحليلات الحافة مثل الأشخاص والمركبات ومعدات السلامة. واستخراج الصور المصححة الأوسع يُعالج بعد الالتقاط.',
      },
      {
        question: 'Will this plug into our GIS or dashboard?',
        questionAr: 'هل يتصل ذلك بنظام المعلومات أو لوحة المتابعة لدينا؟',
        answer:
          'That is the intended handover. Outputs are specified as layers, tables, or alerts for the system you name, rather than as a model file with no operational home.',
        answerAr:
          'هذا هو التسليم المقصود. تُحدد المخرجات كطبقات أو جداول أو تنبيهات للنظام الذي تسمونه، لا كملف نموذج بلا موضع تشغيلي.',
      },
    ],
    ctaTitle: 'Scope an AI pilot',
    ctaTitleAr: 'حدد نطاق تجربة ذكاء اصطناعي',
    ctaDescription:
      'Describe the decision you want automated, the imagery you have or need, and where the result should appear. We will propose the classes, the data, and the test.',
    ctaDescriptionAr:
      'صف القرار الذي تريد أتمتته والصور التي لديكم أو تحتاجونها وأين يجب أن تظهر النتيجة. سنقترح الفئات والبيانات والاختبار.',
    seoTitle: 'AI Application Development | Shamal Technologies',
    seoDescription:
      'Geospatial AI in Saudi Arabia. Custom detection, orthomosaic classification, and edge analytics for aerial operations by Shamal Technologies.',
    seoKeywords:
      'geospatial AI Saudi Arabia, drone object detection, orthomosaic classification, GeoAI, edge analytics, Shamal Technologies',
  },

  'agriculture-monitoring': {
    heroTitle: 'Every block, not a sample walk',
    heroTitleAr: 'كل قطعة لا جولة عينات',
    heroDescription:
      'Plantation and crop intelligence from LiDAR, multispectral, and soil-moisture sensing — canopy change, plant stress, and wet or dry zones mapped at field scale.',
    heroDescriptionAr:
      'معلومات المزارع والمحاصيل من الليدار والاستشعار متعدد الأطياف ورطوبة التربة: تغيّر المظلة وإجهاد النبات والمناطق الرطبة أو الجافة على مستوى الحقل.',
    overviewTitle: 'Growth and water, mapped before the stress shows',
    overviewTitleAr: 'النمو والماء يُرسمان قبل ظهور الإجهاد',
    overview:
      'A walk through a plantation cannot track individual canopy change or find dry and over-saturated ground until the crop already shows it. Shamal flies repeat LiDAR to build canopy height models, multispectral passes for indices such as NDVI, and soil-moisture sensing to flag zones that need a different water regime.\n\nDeliverables are made for the agronomy team: classified point clouds, canopy models, NDVI GeoTIFFs, and moisture heat maps, georeferenced so a finding can be walked to.',
    overviewAr:
      'لا تستطيع جولة في المزرعة تتبع تغيّر مظلة كل شجرة أو اكتشاف الأرض الجافة أو المشبعة إلا بعد أن يُظهر المحصول ذلك. تحلق شمل بالليدار بشكل متكرر لبناء نماذج ارتفاع المظلة، وبتمريرات متعددة الأطياف لمؤشرات مثل NDVI، وبحساسات رطوبة التربة للإشارة إلى مناطق تحتاج نظام ري مختلفاً.\n\nتُعد المخرجات لفريق الزراعة: سحب نقاط مصنفة ونماذج مظلة وملفات NDVI بصيغة GeoTIFF وخرائط حرارة للرطوبة، مسندة جغرافياً حتى يمكن الوصول إلى النتيجة في الحقل.',
    benefits: [
      {
        title: 'Canopy change you can measure',
        titleAr: 'تغيّر مظلة يمكن قياسه',
        description: 'Repeat LiDAR point clouds and canopy height models show growth between dates, tree by tree at field scale.',
        descriptionAr: 'تُظهر سحب نقاط الليدار المتكررة ونماذج ارتفاع المظلة النمو بين التواريخ على مستوى الحقل.',
      },
      {
        title: 'Stress before it is visible',
        titleAr: 'الإجهاد قبل أن يُرى',
        description: 'Multispectral indices reveal plant condition that a visual walk will only confirm later.',
        descriptionAr: 'تكشف المؤشرات متعددة الأطياف حالة النبات التي لن تؤكدها الجولة البصرية إلا لاحقاً.',
      },
      {
        title: 'Water where it is wrong',
        titleAr: 'الماء حيث يكون غير مناسب',
        description: 'Soil-moisture maps flag dry and over-saturated zones for irrigation decisions.',
        descriptionAr: 'تشير خرائط رطوبة التربة إلى المناطق الجافة والمشبعة لقرارات الري.',
      },
      {
        title: 'Field-scale, not a sample',
        titleAr: 'على مستوى الحقل لا العينة',
        description: 'Repeatable coverage of plantation blocks in a single planned mission.',
        descriptionAr: 'تغطية قابلة للتكرار لقطع المزرعة في مهمة مخططة واحدة.',
      },
      {
        title: 'Georeferenced for the crew',
        titleAr: 'مسندة جغرافياً للفريق',
        description: 'Findings land on a map the field team can navigate to, not in a general report.',
        descriptionAr: 'تقع النتائج على خريطة يستطيع الفريق الميداني التوجه إليها لا في تقرير عام.',
      },
      {
        title: 'A season you can compare',
        titleAr: 'موسم يمكن مقارنته',
        description: 'The same flight and processing path so this cycle is measured against the last.',
        descriptionAr: 'مسار الطيران والمعالجة نفسه حتى تُقاس هذه الدورة مقابل السابقة.',
      },
    ],
    applications: [
      {
        title: 'Palm and plantation health',
        titleAr: 'صحة النخيل والمزارع',
        description: 'Canopy structure and change tracked across blocks that cannot be inspected tree by tree on foot.',
        descriptionAr: 'تتبع بنية المظلة وتغيرها عبر قطع لا يمكن فحصها شجرة شجرة سيراً.',
      },
      {
        title: 'Crop stress mapping',
        titleAr: 'رسم إجهاد المحصول',
        description: 'NDVI and multispectral orthomosaics for early variation in plant condition.',
        descriptionAr: 'مؤشر NDVI وصور مصححة متعددة الأطياف للتباين المبكر في حالة النبات.',
      },
      {
        title: 'Irrigation diagnostics',
        titleAr: 'تشخيص الري',
        description: 'Moisture heat maps that separate dry ground from over-watered ground.',
        descriptionAr: 'خرائط حرارة للرطوبة تفصل الأرض الجافة عن الأرض زائدة الري.',
      },
      {
        title: 'Growth monitoring',
        titleAr: 'مراقبة النمو',
        description: 'Repeat canopy height models for programmes that need a measured growth record.',
        descriptionAr: 'نماذج ارتفاع مظلة متكررة للبرامج التي تحتاج سجل نمو مقيساً.',
      },
      {
        title: 'Large agricultural holdings',
        titleAr: 'الحيازات الزراعية الكبيرة',
        description: 'Coverage planned in repeatable blocks so a holding is monitored to one specification.',
        descriptionAr: 'تغطية مخططة في قطع قابلة للتكرار حتى تُراقب الحيازة بمواصفة واحدة.',
      },
      {
        title: 'Environmental vegetation checks',
        titleAr: 'فحوصات الغطاء البيئي',
        description: 'The same multispectral method applied where planted or natural vegetation must be reported.',
        descriptionAr: 'منهج الأطياف نفسه حيث يجب تقرير الغطاء المزروع أو الطبيعي.',
      },
    ],
    technologies: [
      {
        name: 'Survey-grade LiDAR',
        nameAr: 'ليدار مساحي',
        description: 'Repeat point clouds in LAS/LAZ for canopy structure and height models.',
        descriptionAr: 'سحب نقاط متكررة بصيغتي LAS وLAZ لبنية المظلة ونماذج الارتفاع.',
      },
      {
        name: 'Canopy height models',
        nameAr: 'نماذج ارتفاع المظلة',
        description: 'A comparable surface of the crop between flight dates.',
        descriptionAr: 'سطح قابل للمقارنة للمحصول بين تواريخ الطيران.',
      },
      {
        name: 'Multispectral NDVI',
        nameAr: 'NDVI متعدد الأطياف',
        description: 'Five-band imagery processed into a health map and a matching RGB orthophoto.',
        descriptionAr: 'صور بخمسة نطاقات تُعالج إلى خريطة صحة وصورة مصححة ملونة مقابلة.',
      },
      {
        name: 'Soil-moisture sensing',
        nameAr: 'استشعار رطوبة التربة',
        description: 'Georeferenced moisture heat maps for dry and over-saturated zones.',
        descriptionAr: 'خرائط حرارة للرطوبة مسندة جغرافياً للمناطق الجافة والمشبعة.',
      },
      {
        name: 'Enterprise multirotor capture',
        nameAr: 'التقاط متعدد المراوح احترافي',
        description: 'Stable, low-altitude flights suited to plantation blocks and field resolution.',
        descriptionAr: 'طلعات مستقرة منخفضة الارتفاع تناسب قطع المزارع ودقة الحقل.',
      },
      {
        name: 'GeoTIFF delivery',
        nameAr: 'تسليم GeoTIFF',
        description: 'Index and moisture maps issued for agronomy software and GIS.',
        descriptionAr: 'خرائط مؤشرات ورطوبة تُسلَّم لبرمجيات الزراعة ونظم المعلومات.',
      },
    ],
    faqs: [
      {
        question: 'What crops and plantations can you monitor?',
        questionAr: 'ما المحاصيل والمزارع التي يمكنكم مراقبتها؟',
        answer:
          'The method is used on palm plantations and other field crops, and on vegetation such as mangrove where a health index is required. The sensor mix depends on whether you need canopy structure, plant stress, moisture, or all three.',
        answerAr:
          'تُستخدم الطريقة في مزارع النخيل وغيرها من المحاصيل الحقلية، وفي غطاء مثل المانجروف حين يلزم مؤشر صحة. ويعتمد مزيج الحساسات على ما إذا كنتم تحتاجون بنية المظلة أو إجهاد النبات أو الرطوبة أو الثلاثة.',
      },
      {
        question: 'How is LiDAR different from an NDVI map?',
        questionAr: 'كيف يختلف الليدار عن خريطة NDVI؟',
        answer:
          'LiDAR measures structure and height, so growth can be compared in three dimensions. NDVI measures reflected light related to plant condition. They answer different questions and are often flown together.',
        answerAr:
          'يقيس الليدار البنية والارتفاع حتى يمكن مقارنة النمو في ثلاثة أبعاد. ويقيس NDVI الضوء المنعكس المرتبط بحالة النبات. وهما يجيبان عن سؤالين مختلفين وغالباً ما يُحلَّق بهما معاً.',
      },
      {
        question: 'Can you tell us where irrigation is failing?',
        questionAr: 'هل يمكنكم تحديد أين يفشل الري؟',
        answer:
          'Soil-moisture mapping flags zones that are dry or over-saturated and places them on a georeferenced heat map for the irrigation team. It shows where to look; it does not open a valve.',
        answerAr:
          'يشير رسم رطوبة التربة إلى المناطق الجافة أو المشبعة ويضعها على خريطة حرارة مسندة جغرافياً لفريق الري. وهو يُظهر أين يُنظر ولا يفتح صماماً.',
      },
      {
        question: 'How often should a plantation be flown?',
        questionAr: 'كم مرة ينبغي تحليق المزرعة؟',
        answer:
          'Often enough to see the change you manage — growth intervals or a stress window — using the same flight lines so the dates compare.',
        answerAr:
          'بالوتيرة التي تكفي لرؤية التغيّر الذي تديرونه، سواء فترات النمو أو نافذة الإجهاد، وباستخدام خطوط الطيران نفسها حتى تتقابل التواريخ.',
      },
      {
        question: 'What files does the agronomy team receive?',
        questionAr: 'ما الملفات التي يستلمها فريق الزراعة؟',
        answer:
          'Depending on the scope: a classified point cloud, a canopy height model, an RGB orthomosaic, a multispectral orthomosaic, an NDVI GeoTIFF, and a soil-moisture heat map.',
        answerAr:
          'حسب النطاق: سحابة نقاط مصنفة ونموذج ارتفاع مظلة وصورة مصححة ملونة وصورة مصححة متعددة الأطياف وملف NDVI بصيغة GeoTIFF وخريطة حرارة لرطوبة التربة.',
      },
    ],
    ctaTitle: 'Plan a field monitoring cycle',
    ctaTitleAr: 'خطط لدورة مراقبة حقلية',
    ctaDescription:
      'Tell us the crop, the area, and whether the question is growth, stress, or water. We will match the payload and the map.',
    ctaDescriptionAr:
      'أخبرنا بالمحصول والمساحة وما إذا كان السؤال النمو أو الإجهاد أو الماء. سنلائم الحمولة والخريطة.',
    seoTitle: 'Agriculture Monitoring | Shamal Technologies',
    seoDescription:
      'Agricultural drone monitoring in Saudi Arabia. LiDAR canopy models, NDVI, and soil-moisture mapping for plantations and crops by Shamal Technologies.',
    seoKeywords:
      'agriculture drone Saudi Arabia, palm plantation monitoring, NDVI, LiDAR canopy, soil moisture mapping, Shamal Technologies',
  },

  'special-projects': {
    heroTitle: 'Innovative solutions for complex challenges',
    heroTitleAr: 'حلول مبتكرة للتحديات المعقدة',
    heroDescription:
      'Specialized drone and geospatial operations for unique, mission-critical work that does not fit a standard survey, inspection, or mapping scope.',
    heroDescriptionAr:
      'عمليات درون ومعلومات جغرافية متخصصة للأعمال الفريدة والحرجة التي لا تنطبق عليها نطاقات المسح أو الفحص أو الرسم المعتادة.',
    overviewTitle: 'Customized operations beyond conventional services',
    overviewTitleAr: 'عمليات مخصصة تتجاوز الخدمات التقليدية',
    overview:
      'Every project has constraints that a catalogue service will not absorb. Shamal’s Special Projects work combines UAV operations, GIS, AI analytics, remote sensing, and field execution for missions that need a method written for the objective — not a method borrowed from the nearest standard product.\n\nThat includes public-sector and smart-city programmes, environmental and research missions, security tasks with an unusual site, and infrastructure work where the deliverable is a decision, not a flight. We take the job from feasibility and mission planning through capture, processing, quality control, and the final report.',
    overviewAr:
      'لكل مشروع قيود لا تستوعبها خدمة جاهزة من قائمة. تجمع أعمال المشاريع الخاصة في شمل عمليات الطائرات ونظم المعلومات وتحليلات الذكاء الاصطناعي والاستشعار عن بعد والتنفيذ الميداني للمهام التي تحتاج منهجاً يُكتب للهدف — لا منهجاً يُستعار من أقرب منتج معياري.\n\nيشمل ذلك برامج القطاع العام والمدن الذكية والمهام البيئية والبحثية والمهام الأمنية في مواقع غير معتادة وأعمال البنية التي يكون تسليمها قراراً لا طلعة. نأخذ العمل من دراسة الجدوى وتخطيط المهمة إلى الالتقاط والمعالجة وضبط الجودة والتقرير النهائي.',
    benefits: [
      {
        title: 'Tailored project execution',
        titleAr: 'تنفيذ يُفصَّل على المشروع',
        description:
          'The aircraft, the sensors, the flight logic, and the files are chosen around the objective and the stakeholders who will use the result.',
        descriptionAr:
          'تُختار الطائرة والحساسات ومنطق الطيران والملفات حول الهدف وأصحاب المصلحة الذين سيستخدمون النتيجة.',
      },
      {
        title: 'Multi-disciplinary team',
        titleAr: 'فريق متعدد التخصصات',
        description:
          'Pilots, GIS specialists, survey staff, analysts, and project managers working as one delivery team.',
        descriptionAr:
          'طيارون ومتخصصو نظم معلومات ومساحون ومحللون ومديرو مشاريع يعملون كفريق تسليم واحد.',
      },
      {
        title: 'Technology matched to the mission',
        titleAr: 'تقنية تُلائم المهمة',
        description:
          'UAV platforms, LiDAR, thermal, multispectral, AI, and GIS combined only where each one earns its place.',
        descriptionAr:
          'منصات الطائرات والليدار والحراري ومتعدد الأطياف والذكاء الاصطناعي ونظم المعلومات تُجمع حيث يبرر كل منها وجوده.',
      },
      {
        title: 'Accuracy with a paper trail',
        titleAr: 'دقة مع أثر موثّق',
        description:
          'Collection, processing, and quality checks documented so the output can be defended, not only viewed.',
        descriptionAr:
          'توثيق الجمع والمعالجة وفحوصات الجودة حتى يمكن الدفاع عن المخرج لا مشاهدته فقط.',
      },
      {
        title: 'Regulatory compliance',
        titleAr: 'التزام تنظيمي',
        description:
          'Approvals, method statements, and site safety planned to Saudi aviation and client requirements before flight.',
        descriptionAr:
          'تخطيط التصاريح وبيانات الطريقة وسلامة الموقع وفق متطلبات الطيران السعودية ومتطلبات العميل قبل الطيران.',
      },
      {
        title: 'End-to-end support',
        titleAr: 'دعم من البداية إلى التسليم',
        description:
          'Feasibility, planning, capture, analysis, and final deliverables under one scope and one point of accountability.',
        descriptionAr:
          'الجدوى والتخطيط والالتقاط والتحليل والمخرجات النهائية ضمن نطاق واحد ومسؤولية واحدة.',
      },
    ],
    applications: [
      {
        title: 'Government and smart-city programmes',
        titleAr: 'برامج الحكومة والمدن الذكية',
        description:
          'Spatial evidence for urban planning, digital programmes, and public infrastructure where the question is new.',
        descriptionAr:
          'أدلة مكانية للتخطيط العمراني والبرامج الرقمية والبنية العامة حين يكون السؤال جديداً.',
      },
      {
        title: 'Environmental and sustainability missions',
        titleAr: 'مهام البيئة والاستدامة',
        description:
          'Habitat, vegetation, and impact monitoring designed around a conservation or compliance question.',
        descriptionAr:
          'مراقبة الموائل والغطاء والأثر مصممة حول سؤال حفظ أو التزام.',
      },
      {
        title: 'Security and strategic sites',
        titleAr: 'المواقع الأمنية والاستراتيجية',
        description:
          'Aerial intelligence and situational awareness for perimeters and assets that do not match a standard patrol.',
        descriptionAr:
          'معلومات جوية ووعي بالموقف للمحيطات والأصول التي لا تطابق دورية معيارية.',
      },
      {
        title: 'Research and proof-of-concept',
        titleAr: 'البحث وإثبات المفهوم',
        description:
          'Custom missions to test a sensor, a model, or a method before it becomes a standing service.',
        descriptionAr:
          'مهام مخصصة لاختبار حساس أو نموذج أو منهج قبل أن يصبح خدمة دائمة.',
      },
      {
        title: 'Large infrastructure programmes',
        titleAr: 'برامج البنية الواسعة',
        description:
          'Complex acquisition and monitoring for transport, utilities, energy, and industrial development.',
        descriptionAr:
          'التقاط ومراقبة معقدان للنقل والمرافق والطاقة والتطوير الصناعي.',
      },
      {
        title: 'Emergency and incident support',
        titleAr: 'دعم الطوارئ والحوادث',
        description:
          'Rapid deployment for damage assessment, incident context, and planning imagery when time is the constraint.',
        descriptionAr:
          'انتشار سريع لتقييم الأضرار وسياق الحادث وصور التخطيط حين يكون الوقت هو القيد.',
      },
    ],
    technologies: [
      {
        name: 'Enterprise UAV platforms',
        nameAr: 'منصات طائرات احترافية',
        description: 'Fixed-wing and multirotor aircraft selected for distance, hover, or endurance as the site demands.',
        descriptionAr: 'طائرات ثابتة الجناح ومتعددة المراوح تُختار للمسافة أو التحليق أو التحمل حسب الموقع.',
      },
      {
        name: 'GIS and spatial analysis',
        nameAr: 'نظم المعلومات والتحليل المكاني',
        description: 'Maps, measurements, and layers prepared for the decision, not only for the archive.',
        descriptionAr: 'خرائط وقياسات وطبقات تُعد للقرار لا للأرشيف فقط.',
      },
      {
        name: 'AI-assisted interpretation',
        nameAr: 'تفسير بمساعدة الذكاء الاصطناعي',
        description: 'Detection and classification where the volume of imagery is beyond manual review.',
        descriptionAr: 'كشف وتصنيف حين يتجاوز حجم الصور المراجعة اليدوية.',
      },
      {
        name: 'LiDAR and remote sensing',
        nameAr: 'الليدار والاستشعار عن بعد',
        description: '3D structure and multispectral indices when a photograph is not the measurement.',
        descriptionAr: 'البنية ثلاثية الأبعاد والمؤشرات متعددة الأطياف حين لا تكون الصورة هي القياس.',
      },
      {
        name: 'Controlled data delivery',
        nameAr: 'تسليم بيانات منضبط',
        description: 'Secure transfer, documented processing, and files your stakeholders can share internally.',
        descriptionAr: 'نقل آمن ومعالجة موثّقة وملفات يستطيع أصحاب المصلحة تداولها داخلياً.',
      },
      {
        name: 'Client-system integration',
        nameAr: 'الربط مع أنظمة العميل',
        description: 'Outputs shaped for an existing GIS, dashboard, or reporting workflow.',
        descriptionAr: 'مخرجات تُشكَّل لنظام معلومات أو لوحة أو مسار تقارير قائم.',
      },
    ],
    faqs: [
      {
        question: 'What counts as a special project?',
        questionAr: 'ما الذي يُعد مشروعاً خاصاً؟',
        answer:
          'Work that needs its own method: a combination of sensors, a non-standard site, a research or government objective, or a deliverable that is not a routine survey, inspection, or map.',
        answerAr:
          'عمل يحتاج منهجه الخاص: مزيج حساسات أو موقع غير معياري أو هدف بحثي أو حكومي أو مخرج ليس مسحاً أو فحصاً أو خريطة روتينية.',
      },
      {
        question: 'Which organisations use this service?',
        questionAr: 'من يستخدم هذه الخدمة؟',
        answer:
          'Government and public programmes, infrastructure and utility developers, industrial operators, environmental teams, security units, and research groups with a defined spatial question.',
        answerAr:
          'البرامج الحكومية والعامة ومطورو البنية والمرافق والمشغّلون الصناعيون والفرق البيئية ووحدات الأمن ومجموعات البحث التي لديها سؤال مكاني محدد.',
      },
      {
        question: 'Can you run multi-site or long programmes?',
        questionAr: 'هل يمكنكم تنفيذ برامج متعددة المواقع أو طويلة؟',
        answer:
          'Yes. Scope, crew, and processing are planned so several locations stay under one method and one project lead, rather than as disconnected flights.',
        answerAr:
          'نعم. يُخطط النطاق والطاقم والمعالجة حتى تبقى المواقع تحت منهج واحد وقيادة مشروع واحدة لا كطلعات منفصلة.',
      },
      {
        question: 'What deliverables can be specified?',
        questionAr: 'ما المخرجات التي يمكن تحديدها؟',
        answer:
          'Maps, GIS databases, 3D models, analytics, dashboards, imagery, and written reports. The list is fixed in the brief, with acceptance criteria, before capture starts.',
        answerAr:
          'خرائط وقواعد نظم معلومات ومجسمات ثلاثية وتحليلات ولوحات وصور وتقارير مكتوبة. وتُثبَّت القائمة في الطلب مع معايير القبول قبل بدء الالتقاط.',
      },
      {
        question: 'Are operations aligned with Saudi regulations?',
        questionAr: 'هل تتوافق العمليات مع الأنظمة السعودية؟',
        answer:
          'Yes. Missions include the applicable flight approvals, method statements, crew qualifications, and client safety requirements. Nothing flies on an improvised plan.',
        answerAr:
          'نعم. تشمل المهام تصاريح الطيران اللازمة وبيانات الطريقة ومؤهلات الطاقم ومتطلبات سلامة العميل. ولا شيء يطير بخطة مرتجلة.',
      },
    ],
    ctaTitle: 'Bring us the problem, not a flight request',
    ctaTitleAr: 'أحضر المشكلة لا طلب الطيران',
    ctaDescription:
      'Describe the decision you need and the constraints on the site. We will propose the method, the outputs, and how the work will be controlled.',
    ctaDescriptionAr:
      'صف القرار الذي تحتاجه والقيود على الموقع. سنقترح المنهج والمخرجات وكيف سيُضبط العمل.',
    seoTitle: 'Special Projects | Shamal Technologies',
    seoDescription:
      'Special drone and geospatial projects in Saudi Arabia. Custom missions for government, infrastructure, environment, security, and research by Shamal Technologies.',
    seoKeywords:
      'special drone projects Saudi Arabia, custom UAV, geospatial consulting, mission planning, Shamal Technologies',
  },

  'traffic-count-traffic-analysis': {
    title: 'Traffic Count & Traffic Analysis',
    titleAr: 'عدّ المرور وتحليل الحركة المرورية',
    heroTitle: 'See the bottleneck, not only the queue',
    heroTitleAr: 'رؤية الاختناق لا الطابور فقط',
    heroDescription:
      'Aerial observation of intersections and corridors, turned into counts, density maps, and movement analysis that show where traffic accumulates and why.',
    heroDescriptionAr:
      'رصد جوي للتقاطعات والممرات يتحول إلى أعداد وخرائط كثافة وتحليل حركة يُظهر أين يتراكم المرور ولماذا.',
    overviewTitle: 'Spatial evidence for a traffic question',
    overviewTitleAr: 'دليل مكاني لسؤال مروري',
    overview:
      'Ground counts struggle to show how a queue at one approach creates the failure at the next. Shamal captures high-resolution aerial video of intersections and corridors, then uses geospatial analysis to map density, congestion hotspots, and drops in speed.\n\nThe result is a picture of movement, not a single total: where vehicles accumulate, how the peak behaves, and which point in the junction is driving the delay. That is the evidence traffic engineers use to test a cause before they change the layout.',
    overviewAr:
      'يصعب على العد الأرضي إظهار كيف يصنع طابور على مدخل واحد التعطل في المدخل التالي. تلتقط شمل فيديو جوياً عالي الدقة للتقاطعات والممرات، ثم تستخدم التحليل الجغرافي لرسم الكثافة ونقاط الازدحام وانخفاض السرعة.\n\nالنتيجة صورة للحركة لا إجمالي واحد: أين تتراكم المركبات وكيف يتصرف وقت الذروة وأي نقطة في التقاطع تقود التأخير. وهذا هو الدليل الذي يستخدمه مهندسو المرور لاختبار السبب قبل تغيير التصميم.',
    benefits: [
      {
        title: 'The whole junction in one view',
        titleAr: 'التقاطع كله في مشهد واحد',
        description: 'Every approach recorded together, so the interaction between movements is visible.',
        descriptionAr: 'تسجيل كل المداخل معاً حتى يظهر التفاعل بين الحركات.',
      },
      {
        title: 'Counts with a location',
        titleAr: 'أعداد بموقع',
        description: 'Volumes and accumulation placed in space, not only written as a table of totals.',
        descriptionAr: 'الحجوم والتراكم في مكانهما لا كجدول إجماليات فقط.',
      },
      {
        title: 'Congestion traced to a cause',
        titleAr: 'الازدحام يُتتبَّع إلى سبب',
        description: 'Density and speed patterns show the hotspot and the movement that feeds it.',
        descriptionAr: 'تُظهر أنماط الكثافة والسرعة نقطة الازدحام والحركة التي تغذيه.',
      },
      {
        title: 'Less time on the roadside',
        titleAr: 'وقت أقل على جانب الطريق',
        description: 'Aerial capture covers a complex intersection in the time a ground crew spends on one approach.',
        descriptionAr: 'يغطي الالتقاط الجوي تقاطعاً معقداً في الوقت الذي يقضيه طاقم أرضي على مدخل واحد.',
      },
      {
        title: 'Peak-hour behaviour',
        titleAr: 'سلوك ساعة الذروة',
        description: 'Video timed to the peak so the analysis matches the period that actually fails.',
        descriptionAr: 'فيديو موقوت على الذروة حتى يطابق التحليل الفترة التي تتعطل فعلاً.',
      },
      {
        title: 'Evidence for design decisions',
        titleAr: 'دليل لقرارات التصميم',
        description: 'Maps and clips a traffic engineer can use in a study, a meeting, or a before-and-after check.',
        descriptionAr: 'خرائط ومقاطع يستطيع مهندس المرور استخدامها في دراسة أو اجتماع أو مقارنة قبل وبعد.',
      },
    ],
    applications: [
      {
        title: 'Critical intersections',
        titleAr: 'التقاطعات الحرجة',
        description: 'Find which movement, queue, or conflict is creating the delay at a failing junction.',
        descriptionAr: 'تحديد أي حركة أو طابور أو تعارض يصنع التأخير في تقاطع متعطل.',
      },
      {
        title: 'Corridor studies',
        titleAr: 'دراسات الممرات',
        description: 'See how congestion cascades from one node to the next along a route.',
        descriptionAr: 'رؤية كيف ينتقل الازدحام من عقدة إلى التي تليها على مسار.',
      },
      {
        title: 'Before-and-after assessment',
        titleAr: 'تقييم قبل وبعد',
        description: 'Repeat the same aerial method after a signal, layout, or management change.',
        descriptionAr: 'إعادة المنهج الجوي نفسه بعد تغيير إشارة أو تصميم أو إدارة.',
      },
      {
        title: 'Event and peak demand',
        titleAr: 'الطلب في الفعاليات والذروة',
        description: 'Capture a known peak — a workday rush or a venue outflow — with full spatial coverage.',
        descriptionAr: 'التقاط ذروة معروفة، ذروة يوم عمل أو خروج من موقع، بتغطية مكانية كاملة.',
      },
      {
        title: 'Urban planning evidence',
        titleAr: 'دليل التخطيط العمراني',
        description: 'Movement patterns for teams testing access, circulation, and network changes.',
        descriptionAr: 'أنماط حركة للفرق التي تختبر الوصول والدوران وتغييرات الشبكة.',
      },
      {
        title: 'Safety and conflict review',
        titleAr: 'مراجعة السلامة والتعارض',
        description: 'Video evidence of how streams interact where a count alone does not explain the risk.',
        descriptionAr: 'دليل فيديو لكيفية تفاعل التيارات حين لا يفسر العد وحده الخطر.',
      },
    ],
    technologies: [
      {
        name: 'Aerial traffic video',
        nameAr: 'فيديو مروري جوي',
        description: 'High-resolution overhead capture of density, queues, and turning movements.',
        descriptionAr: 'التقاط علوي عالي الدقة للكثافة والطوابير وحركات الانعطاف.',
      },
      {
        name: 'Geospatial density maps',
        nameAr: 'خرائط كثافة جغرافية',
        description: 'Heatmaps that locate accumulation instead of averaging it away.',
        descriptionAr: 'خرائط حرارة تحدد التراكم بدلاً من طمسه في متوسط.',
      },
      {
        name: 'Speed and hotspot analysis',
        nameAr: 'تحليل السرعة ونقاط الازدحام',
        description: 'Where velocity drops, and which approach is feeding the delay.',
        descriptionAr: 'أين تنخفض السرعة وأي مدخل يغذي التأخير.',
      },
      {
        name: 'Movement counts',
        nameAr: 'أعداد الحركة',
        description: 'Classified observation of how volume is distributed across the junction.',
        descriptionAr: 'رصد مصنَّف لكيفية توزيع الحجم على التقاطع.',
      },
      {
        name: 'Repeatable flight windows',
        nameAr: 'نوافذ طيران قابلة للتكرار',
        description: 'The same overhead view timed to comparable peaks for before-and-after studies.',
        descriptionAr: 'المنظر العلوي نفسه موقوتاً على ذروات قابلة للمقارنة لدراسات قبل وبعد.',
      },
      {
        name: 'Engineering-ready packs',
        nameAr: 'حزم جاهزة للهندسة',
        description: 'Maps, clips, and a written reading of what the peak actually did.',
        descriptionAr: 'خرائط ومقاطع وقراءة مكتوبة لما فعلته الذروة فعلاً.',
      },
    ],
    faqs: [
      {
        question: 'Do you provide traffic counts or only video?',
        questionAr: 'هل تقدمون أعداد مرور أم فيديو فقط؟',
        answer:
          'Both. The video is the evidence. The delivery adds counts, density maps, and an analysis of where vehicles accumulate and where speed drops, so the clip is not left for you to interpret alone.',
        answerAr:
          'كلاهما. الفيديو هو الدليل. ويضيف التسليم الأعداد وخرائط الكثافة وتحليلاً لأماكن تراكم المركبات وانخفاض السرعة، حتى لا يُترك المقطع لتفسيركم وحدكم.',
      },
      {
        question: 'Why use an aircraft instead of cameras on the ground?',
        questionAr: 'لماذا الطائرة بدلاً من الكاميرات على الأرض؟',
        answer:
          'An overhead view holds every approach in one frame, which is what shows how one queue affects the next. Ground cameras are strong on a single stop line and weak on the whole junction.',
        answerAr:
          'المنظر العلوي يُبقي كل المداخل في إطار واحد، وهذا ما يُظهر كيف يؤثر طابور في الذي يليه. والكاميرات الأرضية قوية على خط توقف واحد وضعيفة على التقاطع كله.',
      },
      {
        question: 'Can this support a before-and-after study?',
        questionAr: 'هل يدعم ذلك دراسة قبل وبعد؟',
        answer:
          'Yes. The flight window, altitude, and view are repeated after the change so the two peaks are comparable.',
        answerAr:
          'نعم. تُعاد نافذة الطيران والارتفاع والمنظر بعد التغيير حتى تكون الذروتان قابلتين للمقارنة.',
      },
      {
        question: 'What sites are suitable?',
        questionAr: 'ما المواقع المناسبة؟',
        answer:
          'Signalised and priority intersections, interchanges, corridors with a known bottleneck, and access points for venues, sites, and urban districts.',
        answerAr:
          'التقاطعات بإشارة أو بأولوية والتبادلات والممرات ذات الاختناق المعروف ومداخل المواقع والأحياء.',
      },
      {
        question: 'What do traffic engineers receive?',
        questionAr: 'ماذا يستلم مهندسو المرور؟',
        answer:
          'Overhead video of the agreed peak, spatial density outputs, a reading of congestion hotspots and speed change, and the counts needed to support the finding.',
        answerAr:
          'فيديو علوي للذروة المتفق عليها ومخرجات كثافة مكانية وقراءة لنقاط الازدحام وتغيّر السرعة والأعداد اللازمة لدعم النتيجة.',
      },
    ],
    ctaTitle: 'Study an intersection properly',
    ctaTitleAr: 'ادرس التقاطع كما ينبغي',
    ctaDescription:
      'Send the location, the peak you care about, and the decision the study has to support. We will propose the capture window and the analysis.',
    ctaDescriptionAr:
      'أرسل الموقع والذروة التي تهمكم والقرار الذي يجب أن تدعمه الدراسة. سنقترح نافذة الالتقاط والتحليل.',
    seoTitle: 'Traffic Count & Traffic Analysis | Shamal Technologies',
    seoDescription:
      'Aerial traffic counts and analysis in Saudi Arabia. Intersection video, density maps, and congestion studies from Shamal Technologies.',
    seoKeywords:
      'traffic count Saudi Arabia, drone traffic analysis, intersection study, congestion heatmap, traffic survey, Shamal Technologies',
  },
}

type PlaceholderDoc = {
  heroDescription?: string | null
  benefits?: { title?: string | null; description?: string | null }[] | null
}

/** True when a service still has the original seeded placeholder copy. */
export function isPlaceholderService(doc: PlaceholderDoc): boolean {
  const hero = doc.heroDescription?.trim() || ''
  const firstBenefit = doc.benefits?.[0]
  return (
    /^Expert .+ services in Saudi Arabia\.?$/.test(hero) ||
    (firstBenefit?.title === 'Expert Team' &&
      firstBenefit?.description === 'Certified professionals with years of experience')
  )
}

const SLUG_ALIASES: Record<string, string> = {
  'traffic-count-traffice-analysis': 'traffic-count-traffic-analysis',
}

/** Payload-ready fields for one service. Omits hero image so existing media is kept. */
export function toServiceDocument(slug: string) {
  const content = SERVICE_CONTENT[SLUG_ALIASES[slug] || slug]
  if (!content) return null

  return {
    ...(content.title ? { title: content.title, generateSlug: false as const, slug } : {}),
    ...(content.titleAr ? { titleAr: content.titleAr } : {}),
    heroTitle: content.heroTitle,
    heroTitleAr: content.heroTitleAr,
    heroDescription: content.heroDescription,
    heroDescriptionAr: content.heroDescriptionAr,
    overviewTitle: content.overviewTitle,
    overviewTitleAr: content.overviewTitleAr,
    overview: content.overview,
    overviewAr: content.overviewAr,
    benefits: content.benefits,
    applications: content.applications,
    technologies: content.technologies,
    faqs: content.faqs.map((faq) => ({
      question: faq.question,
      questionAr: faq.questionAr,
      answer: lexicalText(faq.answer, 'ltr'),
      answerAr: lexicalText(faq.answerAr, 'rtl'),
    })),
    ctaTitle: content.ctaTitle,
    ctaTitleAr: content.ctaTitleAr,
    ctaDescription: content.ctaDescription,
    ctaDescriptionAr: content.ctaDescriptionAr,
    ctaButtonText: 'Contact Us',
    ctaButtonTextAr: 'تواصل معنا',
    seo: {
      title: content.seoTitle,
      description: content.seoDescription,
      keywords: content.seoKeywords,
    },
  }
}

