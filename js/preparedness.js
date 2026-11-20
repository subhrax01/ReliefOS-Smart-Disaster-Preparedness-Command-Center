/* ==========================================================================
   ReliefOS — Disaster Preparedness Center
   Covers Cyclones, Floods, Earthquakes, Heatwaves, and Fires.
   With West Bengal & Indian context, interactive checklists, voice guidance,
   and authoritative government disaster links.
   ========================================================================== */

import { Storage } from './storage.js';
import { VoiceSystem } from './voice.js';
import { t, getLanguage } from './translations.js';

export const DISASTER_DATA = {
  cyclone: {
    id: 'cyclone',
    icon: 'assets/icons/cyclone.svg',
    titleEn: 'Cyclone & Coastal Storm Surge',
    titleBn: 'ঘূর্ণিঝড় ও উপকূলীয় জলোচ্ছ্বাস',
    contextEn: 'Bengal Delta & Coastal Odisha/West Bengal (Digha, Sundarbans, Sagar Island). Frequent severe cyclonic storms in April-May & Oct-Dec.',
    contextBn: 'বঙ্গোপসাগর ও সুন্দরবন উপকূল (দিঘা, সাগরদ্বীপ, কাকদ্বীপ)। প্রাক ও পরবর্তী বর্ষাকালে তীব্র ঘূর্ণাবর্তের উচ্চ ঝুঁকি।',
    color: '#00E5FF',
    cautionEn: 'Never venture near sea dikes or embankments during storm warnings. Beware of the calm "eye" of the cyclone — destructive winds will resume suddenly from the opposite direction.',
    cautionBn: 'ঝড়ের সতর্কবার্তার সময় বাঁধ বা সমুদ্রের ধারে যাবেন না। ঘূর্ণিঝড়ের "চোখ" বা কেন্দ্রের শান্ত অবস্থায় বিভ্রান্ত হবেন না — বিপরীত দিক থেকে পুনরায় প্রচণ্ড ঝড় শুরু হতে পারে।',
    checklists: {
      before: [
        { id: 'cyc-b-1', textEn: 'Secure roof sheets, loose tiles, and trim tree branches near electrical wires', textBn: 'ঘরের টিনের চাল ও আলগা জিনিসপত্র শক্ত করে বাঁধুন এবং বিদ্যুতের তারের কাছের ডালপালা ছাঁটুন' },
        { id: 'cyc-b-2', textEn: 'Pack waterproof emergency survival bag (food, ORS, chlorine tablets, torch, power bank)', textBn: 'জলরোধী ব্যাগে শুকনো খাবার, ওআরএস, হ্যালোজেন/ক্লোরিন ট্যাবলেট, টর্চ ও পাওয়ার ব্যাংক রাখুন' },
        { id: 'cyc-b-3', textEn: 'Keep battery-powered transistor radio ready for official All India Radio / IMD bulletins', textBn: 'আবহাওয়া দপ্তরের সতর্কবার্তা শোনার জন্য ব্যাটারিচালিত ট্রানজিস্টার রেডিও প্রস্তুত রাখুন' },
        { id: 'cyc-b-4', textEn: 'Identify the nearest fortified Cyclone Shelter (Multipurpose Cyclone Shelter - MPCS)', textBn: 'নিকটবর্তী বহুমুখী সাইক্লোন শেল্টারের অবস্থান জেনে রাখুন ও স্থানান্তরের প্রস্তুতি নিন' },
        { id: 'cyc-b-5', textEn: 'Store at least 15 liters of drinking water per person in sealed containers', textBn: 'ব্যক্তিপ্রতি অন্তত ১৫ লিটার পানীয় জল সিলকরা পাত্রে নিরাপদে মজুত রাখুন' }
      ],
      during: [
        { id: 'cyc-d-1', textEn: 'Switch off main electricity breaker and close all LPG gas cylinder valves immediately', textBn: 'ঘরের মূল বৈদ্যুতিক মেইন সুইচ ও এলপিজি গ্যাস সিলিন্ডারের রেগুলেটর অবিলম্বে বন্ধ করুন' },
        { id: 'cyc-d-2', textEn: 'Stay in the safest interior room away from glass windows and external doors', textBn: 'কাচের জানালা ও বাইরের দরজা থেকে দূরে ঘরের সবচেয়ে নিরাপদ অংশে অবস্থান করুন' },
        { id: 'cyc-d-3', textEn: 'Do not spread unverified rumors on social media; rely strictly on official IMD/NDMA updates', textBn: 'সোশ্যাল মিডিয়ায় ভুয়ো গুজবে কান দেবেন না; শুধুমাত্র সরকারি আবহাওয়া বার্তার ওপর ভরসা রাখুন' },
        { id: 'cyc-d-4', textEn: 'Keep footwear on and protect head with cushions or helmets in case of structural debris', textBn: 'ভেঙে পড়া ধ্বংসাবশেষ থেকে বাঁচতে মাথায় হেলমেট বা বালিশ এবং পায়ে শক্ত জুতো পরে থাকুন' }
      ],
      after: [
        { id: 'cyc-a-1', textEn: 'Watch out for submerged electrical live wires and snapped transmission cables', textBn: 'জলমগ্ন ছেঁড়া বিদ্যুতের তার এবং হেলে পড়া বৈদ্যুতিক খুঁটি থেকে নিরাপদ দূরত্ব বজায় রাখুন' },
        { id: 'cyc-a-2', textEn: 'Boil all drinking water or treat with water purification tablets before consumption', textBn: 'পানীয় জল খাওয়ার আগে ভালো করে ফুটিয়ে নিন অথবা ক্লোরিন ট্যাবলেট দিয়ে বিশুদ্ধ করুন' },
        { id: 'cyc-a-3', textEn: 'Photograph structural property damage for insurance and government relief documentation', textBn: 'সরকারি ত্রাণ বা বিমা দাবির জন্য ক্ষতিগ্রস্ত বাড়ির স্পষ্ট ছবি তুলে রাখুন' },
        { id: 'cyc-a-4', textEn: 'Do not enter damaged buildings until inspected and certified safe by civil defence engineers', textBn: 'যথাযথ ইঞ্জিনিয়ার বা প্রশাসনের অনুমতি ছাড়া বিপজ্জনক ও ক্ষতিগ্রস্ত ভবনে প্রবেশ করবেন না' }
      ]
    }
  },

  flood: {
    id: 'flood',
    icon: 'assets/icons/flood.svg',
    titleEn: 'Monsoon & Riverine Inundation',
    titleBn: 'বন্যা ও জলপ্লাবন',
    contextEn: 'Gangetic West Bengal floodplains, Damodar, Teesta, and Torsa basins. Sudden flash floods & urban waterlogging.',
    contextBn: 'গঙ্গা-ভাগীরথী, দামোদর, তিস্তা ও তোর্সা অববাহিকা। অতিবৃষ্টি এবং বাঁধ থেকে জল ছাড়ার ফলে আকস্মিক বন্যা।',
    color: '#2979FF',
    cautionEn: 'Never walk or drive through moving flood waters — 15 cm of moving water can knock you down, and 30 cm can carry away vehicles. Beware of snakes and waterborne contamination.',
    cautionBn: 'প্রবাহিত বন্যার জলের মধ্য দিয়ে হাঁটা বা গাড়ি চালানোর চেষ্টা করবেন না। মাত্র ৬ ইঞ্চি বয়ে যাওয়া জল মানুষকে ভাসিয়ে নিতে পারে। সাপের উপদ্রব ও জলবাহিত রোগ সম্পর্কে সতর্ক থাকুন।',
    checklists: {
      before: [
        { id: 'fld-b-1', textEn: 'Elevate furniture, essential electronics, and gas appliances to upper floor/shelves', textBn: 'মূল্যবান আসবাব, ইলেক্ট্রনিক্স সামগ্রী ও গ্যাস সিলিন্ডার ঘরের উঁচুতে বা দোতলায় সরিয়ে রাখুন' },
        { id: 'fld-b-2', textEn: 'Safeguard land deeds, ration cards, Aadhaar, and marksheets in double waterproof pouches', textBn: 'আধার, ভোটার কার্ড, জমির দলিল ও জরুরি কাগজপত্র জলরোধী পলিথিন ব্যাগে সংরক্ষণ করুন' },
        { id: 'fld-b-3', textEn: 'Identify high ground evacuation points and pre-marked flood relief camps', textBn: 'নিকটবর্তী উঁচু বাঁধ বা ত্রাণ শিবিরের নিরাপদ গমনপথ পূর্বেই জেনে রাখুন' },
        { id: 'fld-b-4', textEn: 'Stockpile Oral Rehydration Salts (ORS), anti-diarrheal medicines, and halogen tablets', textBn: 'ওআরএস, পেটের জরুরি ওষুধ ও জল বিশুদ্ধকরণ ট্যাবলেট পর্যাপ্ত পরিমাণে মজুত রাখুন' }
      ],
      during: [
        { id: 'fld-d-1', textEn: 'Move immediately to elevated shelter or upper floors; do not wait until water enters home', textBn: 'বাড়ির ভেতর জল ঢোকার অপেক্ষা না করে আগেই নিরাপদ উঁচু স্থানে বা আশ্রমে চলে যান' },
        { id: 'fld-d-2', textEn: 'Turn off electricity from main switch before water reaches electrical sockets', textBn: 'বৈদ্যুতিক প্লাগ বা বোর্ডের কাছে জল পৌঁছানোর আগেই মেইন সুইচ বন্ধ করে দিন' },
        { id: 'fld-d-3', textEn: 'Do not swim through floodwaters; use a sturdy bamboo stick to test ground depth when walking', textBn: 'বন্যার জলে সাঁতার কাটবেন না; হাঁটার সময় বাঁশের লাঠি দিয়ে মাটির গভীরতা ও গর্ত পরীক্ষা করুন' }
      ],
      after: [
        { id: 'fld-a-1', textEn: 'Disinfect all flooded rooms with bleaching powder or lime to prevent epidemic spread', textBn: 'রোগজীবাণু ও মহামারী রোধে ঘরে ও চারপাশে ব্লিচিং পাউডার ও চুন ছড়ান' },
        { id: 'fld-a-2', textEn: 'Discard all open food items that have touched floodwaters even if lightly contaminated', textBn: 'বন্যার জলের সংস্পর্শে আসা সমস্ত খাবার ফেলে দিন, কোনোভাবেই তা গ্রহণ করবেন না' },
        { id: 'fld-a-3', textEn: 'Check for snakes, scorpions, and pests that seek shelter in elevated dry crevices inside home', textBn: 'ঘরের শুকনো অংশ ও কোণে সাপ, বিছে বা বিষাক্ত পোকামাকড়ের উপস্থিতি সতর্কতার সাথে পরীক্ষা করুন' }
      ]
    }
  },

  earthquake: {
    id: 'earthquake',
    icon: 'assets/icons/earthquake.svg',
    titleEn: 'Seismic Shock & Tremor (Zone III & IV)',
    titleBn: 'ভূমিকম্প ও ভূকম্পন (জোন ৩ ও ৪)',
    contextEn: 'North Bengal (Darjeeling/Jalpaiguri in Zone IV/V high risk). Kolkata & South Bengal in Seismic Zone III moderate risk.',
    contextBn: 'উত্তরবঙ্গ (দার্জিলিং, জলপাইগুড়ি - জোন ৪ ও ৫ অত্যন্ত ঝুঁকিপূর্ণ)। কলকাতা ও দক্ষিণবঙ্গ সিসমিক জোন ৩-এর আওতাভুক্ত।',
    color: '#FFB300',
    cautionEn: 'DROP, COVER, AND HOLD ON. Do not run outside while shaking continues. Never use elevators during or after seismic shocks.',
    cautionBn: 'মাটিতে বসে পড়ুন, শক্ত টেবিল বা খাটের নিচে আশ্রয় নিন ও শক্ত করে ধরে রাখুন (Drop, Cover, Hold On)। ঝাঁকুনি চলাকালীন সিঁড়ি দিয়ে নিচে নামার চেষ্টা করবেন না এবং লিফট ব্যবহার করবেন না।',
    checklists: {
      before: [
        { id: 'eq-b-1', textEn: 'Fasten heavy almirahs, book shelves, and wall mirrors securely to masonry walls', textBn: 'ভারী আলমারি, বুকশেলফ ও ঝুলন্ত আয়না দেওয়ালের সাথে স্ক্রু দিয়ে শক্ত করে আটকে রাখুন' },
        { id: 'eq-b-2', textEn: 'Identify safe interior zones under sturdy tables away from exterior windows and chandeliers', textBn: 'বাড়ির ভেতরে শক্ত টেবিল বা খাটের নিচে নিরাপদ স্থান চিহ্নিত করে রাখুন' },
        { id: 'eq-b-3', textEn: 'Teach all household members the DROP, COVER, HOLD ON drill procedure', textBn: 'পরিবারের সকলকে "ড্রপ, কভার এবং হোল্ড অন" পদ্ধতি নিয়মিত অভ্যাস করান' },
        { id: 'eq-b-4', textEn: 'Keep a sturdy flashlight and thick whistle by your bedside for search signaling', textBn: 'বিছানার পাশে সবসময় একটি উজ্জ্বল টর্চ ও সংকেত দেওয়ার বাঁশি রাখুন' }
      ],
      during: [
        { id: 'eq-d-1', textEn: 'DROP to hands and knees; COVER head and neck under sturdy desk; HOLD ON until tremors stop', textBn: 'হাঁটু গেড়ে বসুন, শক্ত ডেস্কের তলায় মাথা ঢেকে রাখুন এবং কাঁপন না থামা পর্যন্ত শক্ত করে ধরে থাকুন' },
        { id: 'eq-d-2', textEn: 'If in bed, stay there and protect head and face with thick pillows', textBn: 'বিছানায় থাকলে নামার চেষ্টা না করে মোটা বালিশ দিয়ে মাথা ও মুখমণ্ডল ঢেকে রাখুন' },
        { id: 'eq-d-3', textEn: 'If outdoors, move immediately into open fields away from buildings, poles, and flyovers', textBn: 'বাইরে থাকলে উঁচু ভবন, উড়ালপুল, গাছ ও বিদ্যুতের তার থেকে দূরে খোলা মাঠে চলে যান' }
      ],
      after: [
        { id: 'eq-a-1', textEn: 'Expect aftershocks. Each time you feel a tremor, immediately Drop, Cover, and Hold On', textBn: 'আফটারশকের জন্য সতর্ক থাকুন; পুনরায় কম্পন অনুভব করলেই সাথে সাথে নিরাপদ স্থানে আশ্রয় নিন' },
        { id: 'eq-a-2', textEn: 'Check for gas leaks by smell. If smelled, open windows and evacuate immediately without switches', textBn: 'গ্যাস লিক হয়েছে কিনা গন্ধ শুঁকে পরীক্ষা করুন; গন্ধ পেলে কোনো সুইচ না ছুঁয়ে বাইরে চলে যান' },
        { id: 'eq-a-3', textEn: 'Use stairs only when evacuating buildings; inspect staircase structural integrity first', textBn: 'ভবন থেকে বের হওয়ার সময় শুধুমাত্র জরুরি সিঁড়ি ব্যবহার করুন, কখনোই লিফটে উঠবেন না' }
      ]
    }
  },

  heatwave: {
    id: 'heatwave',
    icon: 'assets/icons/heatwave.svg',
    titleEn: 'Severe Summer Heatwave & Humidity',
    titleBn: 'তীব্র তাপপ্রবাহ ও আর্দ্র দাবদাহ',
    contextEn: 'Western districts (Bankura, Purulia, Jhargram, Paschim Bardhaman) exceeding 43°C; Coastal Bengal facing extreme wet-bulb index.',
    contextBn: 'বাঁকুড়া, পুরুলিয়া, পশ্চিম বর্ধমানে পারদ ৪৩ ডিগ্রি ছাড়ায়; কলকাতা ও উপকূলীয় অঞ্চলে চরম আর্দ্রতাজনিত অস্বস্তি।',
    color: '#FF9100',
    cautionEn: 'Heat stroke is a medical emergency. If someone exhibits confusion, dry hot skin, or loss of consciousness, call 108/112 immediately and cool body with cold wet cloths.',
    cautionBn: 'হিট স্ট্রোক একটি প্রাণঘাতী জরুরি অবস্থা। রোগীর বিভ্রান্তি, ত্বক শুকিয়ে যাওয়া বা অজ্ঞান হওয়ার লক্ষণ দেখলে অবিলম্বে ১০৮/১১২ নম্বরে ফোন করুন এবং বরফ বা ভেজা কাপড় দিয়ে গা মুছিয়ে দিন।',
    checklists: {
      before: [
        { id: 'hw-b-1', textEn: 'Stock adequate Oral Rehydration Salts (ORS), coconut water, glucose, and buttermilk', textBn: 'ঘরে পর্যাপ্ত ওআরএস (ORS), ডাবের জল, গ্লুকোজ ও লেবুর শরবতের ব্যবস্থা রাখুন' },
        { id: 'hw-b-2', textEn: 'Hang dark-colored curtains or blinds on sun-facing west/south windows', textBn: 'পশ্চিম ও দক্ষিণমুখী জানলায় ভারী পর্দা বা খড়খড়ি লাগিয়ে তীব্র রোদ আটকে দিন' },
        { id: 'hw-b-3', textEn: 'Plan essential outdoor work strictly before 10:00 AM or after 5:00 PM', textBn: 'বাইরের সমস্ত প্রয়োজনীয় কাজকর্ম সকাল ১০টার আগে অথবা বিকেল ৫টার পরে করার পরিকল্পনা করুন' }
      ],
      during: [
        { id: 'hw-d-1', textEn: 'Drink water at regular 20-minute intervals even if you do not feel thirsty', textBn: 'তেষ্টা না পেলেও প্রতি ২০ মিনিট অন্তর পর্যাপ্ত পরিমাণে সাধারণ জল বা নুন-চিনির জল পান করুন' },
        { id: 'hw-d-2', textEn: 'Wear lightweight, loose-fitting, light-colored cotton clothing and wide-brim hats or umbrellas', textBn: 'হালকা রঙের ঢিলেঢালা সুতির পোশাক পরুন এবং রোদে বের হলে অবশ্যই ছাতা ও চশমা ব্যবহার করুন' },
        { id: 'hw-d-3', textEn: 'Never leave children, elderly persons, or pets unattended in parked vehicles', textBn: 'বন্ধ গাড়িতে শিশু, বয়স্ক মানুষ বা গৃহপালিত পশুকে কখনোই একা রেখে যাবেন না' }
      ],
      after: [
        { id: 'hw-a-1', textEn: 'Rehydrate with balanced electrolyte fluids; avoid alcohol, carbonated sodas, and excessive tea', textBn: 'ইলেক্ট্রোলাইট ও জল দিয়ে শরীর আর্দ্র রাখুন; অতিরিক্ত চা, কফি বা অ্যালকোহল বর্জন করুন' },
        { id: 'hw-a-2', textEn: 'Take cool baths or apply cold water sponges to neck, armpits, and groin if feeling fatigued', textBn: 'ক্লান্তি বা গরমের অস্বস্তিতে ঠান্ডা জলে স্নান করুন অথবা ঘাড় ও বগলে ভেজা কাপড়ের পট্টি দিন' }
      ]
    }
  },

  fire: {
    id: 'fire',
    icon: 'assets/icons/fire.svg',
    titleEn: 'Urban Structure & High-Rise Fire',
    titleBn: 'অগ্নিকাণ্ড ও শর্ট-সার্কিট',
    contextEn: 'Dense urban settlements, high-rise residential towers, market complexes, and industrial warehouses across Kolkata & Howrah.',
    contextBn: 'কলকাতা ও হাওড়ার ঘনবসতিপূর্ণ অঞ্চল, বহুতল আবাসন, পাইকারি বাজার ও গুদামঘরে অগ্নিকাণ্ডের ঝুঁকি।',
    color: '#FF1744',
    cautionEn: 'Smoke inhalation kills faster than flames. CRAWL LOW under smoke where fresh air is found. Never open a hot door knob with bare hands.',
    cautionBn: 'আগুনের চেয়ে ধোঁয়ায় দমবন্ধ হয়ে বেশি মৃত্যু ঘটে। ধোঁয়ার স্তর থেকে বাঁচতে মেঝের কাছাকাছি হামাগুড়ি দিয়ে বের হন। গরম দরজার হাতল খালি হাতে স্পর্শ করবেন না।',
    checklists: {
      before: [
        { id: 'fir-b-1', textEn: 'Install and inspect ABC Dry Powder fire extinguishers on every floor/kitchen', textBn: 'রান্নাঘর ও প্রতিটি তলায় উপযুক্ত ড্রাই পাউডার অগ্নিনির্বাপক সিলিন্ডার রাখুন ও তার মেয়াদ পরীক্ষা করুন' },
        { id: 'fir-b-2', textEn: 'Keep emergency fire exit staircases completely clear of stored boxes and obstacles', textBn: 'জরুরি বহির্গমন সিঁড়ি ও পথ কখনোই আসবাবপত্র বা বাক্স রেখে অবরুদ্ধ করবেন না' },
        { id: 'fir-b-3', textEn: 'Memorize the P.A.S.S. technique: Pull pin, Aim nozzle, Squeeze handle, Sweep side-to-side', textBn: 'অগ্নিনির্বাপক ব্যবহারের P.A.S.S. নিয়ম জানুন: পিন খুলুন, নিশানা করুন, চাপ দিন ও ডানে-বামে ছড়ান' }
      ],
      during: [
        { id: 'fir-d-1', textEn: 'Raise loud alarm immediately and call 101 / 112 Fire Dispatch without hesitation', textBn: 'চিৎকার করে সকলকে সতর্ক করুন এবং দ্বিধা না করে সাথে সাথে ১০১ বা ১১২ নম্বরে দমকলকে জানান' },
        { id: 'fir-d-2', textEn: 'Crawl low beneath the rising smoke ceiling to reach the designated fire exit', textBn: 'ধোঁয়ার স্তর থেকে বাঁচতে মেঝের কাছাকাছি নিচু হয়ে হামাগুড়ি দিয়ে প্রস্থান পথের দিকে এগোন' },
        { id: 'fir-d-3', textEn: 'If clothes catch fire: STOP, DROP to ground, and ROLL repeatedly to smother flames', textBn: 'পোশাকে আগুন লাগলে দৌড়াবেন না: থামুন, মাটিতে শুয়ে পড়ুন এবং বারবার গড়াগড়ি দিন (Stop, Drop, Roll)' }
      ],
      after: [
        { id: 'fir-a-1', textEn: 'Treat minor burns with cool, running water for at least 10 minutes; never apply ice or butter', textBn: 'পোড়া স্থানে অন্তত ১০ মিনিট পরিষ্কার ঠান্ডা জল ঢালুন; কখনোই বরফ, টুথপেস্ট বা মাখন লাগাবেন না' },
        { id: 'fir-a-2', textEn: 'Do not re-enter the burnt premises until the Fire Commander declares it structurally safe', textBn: 'দমকল আধিকারিকদের অনুমতি ছাড়া পুনরায় আগুনে ক্ষতিগ্রস্ত ভবনে প্রবেশ করবেন না' }
      ]
    }
  }
};

export const PreparednessSystem = {
  currentCategory: 'cyclone',

  init() {
    this.renderCategoryTabs();
    this.renderActiveDisasterGuide(this.currentCategory);
    this.setupListeners();
  },

  setupListeners() {
    window.addEventListener('reliefos:language-changed', () => {
      this.renderCategoryTabs();
      this.renderActiveDisasterGuide(this.currentCategory);
    });
  },

  renderCategoryTabs() {
    const tabsContainer = document.getElementById('disaster-category-tabs');
    if (!tabsContainer) return;

    const lang = getLanguage();
    tabsContainer.innerHTML = Object.keys(DISASTER_DATA).map(key => {
      const data = DISASTER_DATA[key];
      const title = lang === 'bn' ? data.titleBn : data.titleEn;
      const isActive = key === this.currentCategory;
      return `
        <button class="tab-btn ${isActive ? 'active' : ''}" data-cat="${key}">
          <img src="${data.icon}" alt="" style="width:18px; height:18px; vertical-align:middle; display:inline-block;">
          ${title}
        </button>
      `;
    }).join('');

    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        this.currentCategory = cat;
        this.renderCategoryTabs();
        this.renderActiveDisasterGuide(cat);
      });
    });
  },

  renderActiveDisasterGuide(key) {
    const data = DISASTER_DATA[key];
    const container = document.getElementById('disaster-guide-content');
    if (!container || !data) return;

    const lang = getLanguage();
    const title = lang === 'bn' ? data.titleBn : data.titleEn;
    const context = lang === 'bn' ? data.contextBn : data.contextEn;
    const caution = lang === 'bn' ? data.cautionBn : data.cautionEn;

    // Calculate completion progress
    const beforeStats = this.calculatePhaseProgress(key, 'before');
    const duringStats = this.calculatePhaseProgress(key, 'during');
    const afterStats = this.calculatePhaseProgress(key, 'after');
    const totalItems = beforeStats.total + duringStats.total + afterStats.total;
    const completedItems = beforeStats.completed + duringStats.completed + afterStats.completed;
    const categoryPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Full text to speak if user clicks Read Aloud
    const textToRead = `${title}. ${context}. Caution: ${caution}.`;

    container.innerHTML = `
      <div class="hud-card" style="border-top: 3px solid ${data.color}; margin-bottom: 1.5rem;">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <div style="width:56px; height:56px; border-radius:12px; background:rgba(6,12,28,0.8); border:1px solid ${data.color}; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px ${data.color}33;">
              <img src="${data.icon}" alt="" style="width:36px; height:36px;">
            </div>
            <div>
              <span class="badge badge-cyan" style="margin-bottom:0.35rem;">REGIONAL HAZARD PROFILE</span>
              <h2 style="font-size:1.6rem; font-weight:700; color:#FFFFFF;">${title}</h2>
              <p style="font-size:0.85rem; color:var(--text-secondary);">${context}</p>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-size:1.4rem; font-weight:800; color:${data.color};">${categoryPct}%</div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">CHECKLIST COMPLETION</div>
          </div>
        </div>

        <!-- Voice toolbar -->
        <div class="voice-toolbar">
          <svg class="voice-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
          <div class="voice-label">${t('readAloudBtn')} (Native Browser Speech)</div>
          <div class="voice-controls">
            <button class="btn btn-secondary btn-sm btn-read-aloud" id="btn-read-active-guide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>${t('readAloudBtn')}</span>
            </button>
          </div>
        </div>

        <!-- Caution box -->
        <div style="background:rgba(255,23,68,0.1); border-left:4px solid var(--status-danger); padding:0.9rem 1.2rem; border-radius:4px; margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; color:#FF5252; font-weight:700; font-family:var(--font-mono); font-size:0.82rem; margin-bottom:0.25rem;">
            ⚠️ CRITICAL LIFE-SAFETY WARNING
          </div>
          <p style="font-size:0.88rem; color:#F0F6FC; line-height:1.45;">${caution}</p>
        </div>

        <!-- Three Checklists (Before, During, After) -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem;">
          <!-- Before Phase -->
          <div class="hud-card" style="background:rgba(8,16,36,0.6);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <h3 style="font-size:1.05rem; font-weight:700; color:#00E5FF;">${t('phaseBefore')}</h3>
              <span class="badge badge-cyan">${beforeStats.completed}/${beforeStats.total}</span>
            </div>
            <div class="checklist-group">
              ${this.renderChecklistGroup(key, 'before', data.checklists.before, lang)}
            </div>
          </div>

          <!-- During Phase -->
          <div class="hud-card" style="background:rgba(8,16,36,0.6);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <h3 style="font-size:1.05rem; font-weight:700; color:#FFB300;">${t('phaseDuring')}</h3>
              <span class="badge badge-demo">${duringStats.completed}/${duringStats.total}</span>
            </div>
            <div class="checklist-group">
              ${this.renderChecklistGroup(key, 'during', data.checklists.during, lang)}
            </div>
          </div>

          <!-- After Phase -->
          <div class="hud-card" style="background:rgba(8,16,36,0.6);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <h3 style="font-size:1.05rem; font-weight:700; color:#00E676;">${t('phaseAfter')}</h3>
              <span class="badge badge-verified">${afterStats.completed}/${afterStats.total}</span>
            </div>
            <div class="checklist-group">
              ${this.renderChecklistGroup(key, 'after', data.checklists.after, lang)}
            </div>
          </div>
        </div>

        <!-- Authoritative Links Footer -->
        <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
          <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-muted);">
            VERIFIED OFFICIAL PORTALS:
          </span>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="https://www.ndma.gov.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">NDMA India ↗</a>
            <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">IMD Weather Bulletins ↗</a>
            <a href="https://wbdmd.gov.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">WB Disaster Management ↗</a>
          </div>
        </div>
      </div>
    `;

    // Attach checklist toggle clicks
    container.querySelectorAll('.checklist-item').forEach(item => {
      item.addEventListener('click', () => {
        const dKey = item.getAttribute('data-disaster');
        const phase = item.getAttribute('data-phase');
        const itemId = item.getAttribute('data-id');
        Storage.toggleChecklistItem(dKey, phase, itemId);
        this.renderActiveDisasterGuide(dKey);
        window.dispatchEvent(new CustomEvent('reliefos:checklist-updated'));
      });
    });

    // Attach Read Aloud Click
    const readBtn = container.querySelector('#btn-read-active-guide');
    if (readBtn) {
      readBtn.addEventListener('click', () => {
        if (readBtn.classList.contains('btn-danger')) {
          VoiceSystem.stop();
        } else {
          VoiceSystem.speak(textToRead);
        }
      });
    }
  },

  renderChecklistGroup(disasterKey, phase, items, lang) {
    return items.map(item => {
      const isDone = Storage.isChecklistItemCompleted(disasterKey, phase, item.id);
      const text = lang === 'bn' ? item.textBn : item.textEn;
      return `
        <div class="checklist-item ${isDone ? 'completed' : ''}" 
             data-disaster="${disasterKey}" 
             data-phase="${phase}" 
             data-id="${item.id}"
             role="checkbox"
             aria-checked="${isDone}">
          <div class="custom-checkbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="item-content">
            <div class="item-title">${text}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  calculatePhaseProgress(disasterKey, phase) {
    const data = DISASTER_DATA[disasterKey];
    if (!data || !data.checklists[phase]) return { completed: 0, total: 0 };
    const items = data.checklists[phase];
    const total = items.length;
    let completed = 0;
    items.forEach(item => {
      if (Storage.isChecklistItemCompleted(disasterKey, phase, item.id)) completed++;
    });
    return { completed, total };
  },

  getGlobalChecklistScore() {
    let totalItems = 0;
    let completedItems = 0;

    Object.keys(DISASTER_DATA).forEach(key => {
      ['before', 'during', 'after'].forEach(phase => {
        const stats = this.calculatePhaseProgress(key, phase);
        totalItems += stats.total;
        completedItems += stats.completed;
      });
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }
};
