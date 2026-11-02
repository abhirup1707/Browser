import type { HumorStyle, ImageAnalysis, JokeResult, SubjectCategory } from '../types/joke';

interface JokeTemplate {
  category: string;
  vibe: string;
  headlines: string[];
  subJokes: string[];
  observations: string[];
  memeTop: string[];
  memeBottom: string[];
  hashtags: string[];
}

export const TEMPLATES_BY_STYLE: Record<HumorStyle, Record<string, JokeTemplate>> = {
  roast: {
    pet_cat: {
      category: 'Cat Having Existential Crisis',
      vibe: 'Supreme Feline Judgment',
      headlines: [
        'Bro is reconsidering all 9 of his lives in a single horrifying second.',
        'This cat looks like a burnt loaf of bread that just witnessed a financial audit.',
        'Eye contact reveals this cat knows exactly what you search on the internet at 2 AM.',
        'Looking like an orange cat that lost custody of the shared brain cell.',
        'That is not a pet; that is an ancient deity deeply offended by the brand of dry food you bought.',
      ],
      subJokes: [
        'Pupils are so dilated they are registering events from alternate timelines.',
        'Probability of knocking a glass of water off your desk in the next 3 minutes: 99.8%.',
        'Bro has seen the ghost in your hallway and the ghost looks equally disappointed in you.',
        'This cat would trade you to the neighbor for half a can of tuna and a crisp cardboard box.',
      ],
      observations: [
        'Pupil dilation: 100% spherical black hole.',
        'Existential regret: -85,000 aura.',
        'Whiskers: Vibrating with pure judgment.',
        'Current goal: Sprint at Mach 4 down the hallway at 3:15 AM.',
      ],
      memeTop: ['ME REALIZING I WASTED', 'STARED INTO THE VOID', 'HUMAN SAID WE NEED TO TALK'],
      memeBottom: ['ALL 9 OF MY LIVES ON NAPS', 'AND THE VOID DEMANDED WET FOOD', 'ABOUT MY SCRATCHING POST BEHAVIOR'],
      hashtags: ['#CatRoast', '#ExistentialCat', '#OrangeCatBehavior', '#CatJudgment'],
    },
    pet_dog: {
      category: 'Canine Chaos & Swagger',
      vibe: 'Good Boy Energy, Zero Brain Cells',
      headlines: [
        'Swagger level: Snoop Dogg\'s stunt double. Brain cell count: A solid, unmoving 1.',
        'Looking like he just invested his entire bone savings into cryptocurrency and lost it all.',
        'The confidence of a wolf, the survival instincts of a golden toaster pastry.',
        'Bro is wearing sunglasses indoors because his future is too bright (and his tail won\'t stop wagging).',
      ],
      subJokes: [
        'He will bark aggressively at a plastic grocery bag fluttering in the wind, but let a burglar take the TV.',
        'Aerodynamic drag from that enthusiastic tail wag could power a small wind turbine.',
        'Bro would trade your family heirlooms for one dropped french fry.',
      ],
      observations: [
        'Tail wag velocity: 450 RPM.',
        'Sunglasses rizz: +1,000,000 aura.',
        'Thoughts in head: Tennis ball... Bacon... Wait what was I doing?',
        'Good boy rating: 14/10.',
      ],
      memeTop: ['WALKING INTO THE DOG PARK', 'THE VET SAID YOU ARE A GOOD BOY', 'HEARD A CHEESE WRAPPER OPEN'],
      memeBottom: ['LIKE I OWN THE PLACE', 'HE DID NOT MENTION SMART BOY', 'FROM 4 MILES AWAY'],
      hashtags: ['#DogRoast', '#RizzDoggo', '#GoodBoyEnergy', '#ZeroBrainCells'],
    },
    tech_programmer: {
      category: 'Late Night Developer Despair',
      vibe: 'Syntax Error in Production',
      headlines: [
        'You look like you fixed one missing semicolon and summoned 421 new compiler errors from the underworld.',
        'Bro is debugging in production with nothing but sheer panic and lukewarm Red Bull.',
        'Looking like your last git commit was named "please work oh god please work i want to sleep".',
        'Stack Overflow went down for 12 minutes and your entire engineering career flashed before your eyes.',
      ],
      subJokes: [
        'Your blood type is currently 85% espresso and 15% existential dread.',
        'Bro looks like he just accidentally ran `rm -rf /` on the client\'s primary database.',
        'Posture has fully evolved into the shape of a cooked shrimp.',
        'The dark mode theme is the only thing keeping your sanity from evaporating.',
      ],
      observations: [
        'Terminal status: Screaming in crimson red.',
        'Blink frequency: 1 blink every 45 minutes.',
        'Coffee mug status: Critical refill required.',
        'Rubber duck: Refusing to talk to you.',
      ],
      memeTop: ['IT WORKED ON MY MACHINE', 'GIT COMMIT: FINAL_FIX_V4_FINAL', 'ONE SEMICOLON WAS MISSING'],
      memeBottom: ['NOW PRODUCTION IS ON FIRE', 'DO NOT TOUCH OR IT CRASHES', 'NOW THE WHOLE SERVER IS DOWN'],
      hashtags: ['#DevDespair', '#ProgrammerRoast', '#CodeNightmare', '#NullPointerPain'],
    },
    gym_fail: {
      category: 'Nuclear Workout Intensity',
      vibe: 'Battle Roar For Baby Weights',
      headlines: [
        'Screaming at 130 decibels like a silverback gorilla while curling a dumbbell that weighs less than your iPhone.',
        'Veins on your forehead look like the subway map of Tokyo, but the weight lifted is equivalent to a banana.',
        'Bro took 4 scoops of pre-workout and is currently fighting invisible demons in the gym mirror.',
        'Looking like you\'re about to bench press a Mack truck, only to pick up the pink 1-lb ankle weights.',
      ],
      subJokes: [
        'Bro is flexing so hard his ancestral lineage can feel the tension.',
        'The grunt-to-weight ratio in this picture violates the Geneva Convention.',
        'One more rep and those forehead veins are going to file for independence.',
      ],
      observations: [
        'Decibel output: Approaching jet engine levels.',
        'Actual dumbbell mass: 0.45 kilograms.',
        'Pre-workout saturation: 400%.',
        'Mirror contact: 100% eye lock.',
      ],
      memeTop: ['PRE-WORKOUT JUST KICKED IN', 'LIGHTWEIGHT BABY', 'THE FACIAL EXPRESSION'],
      memeBottom: ['LIFTING THE 1 LB DUMBBELL', 'LITERALLY 1 POUND', 'VS THE ACTUAL WEIGHT MOVED'],
      hashtags: ['#GymBroRoast', '#PreWorkoutEnergy', '#BabyWeights', '#MaximumGrip'],
    },
    diy_fail: {
      category: 'The Trust Me I Am An Engineer Fix',
      vibe: 'Structural Hope & 4 Miles of Tape',
      headlines: [
        'Structural integrity of this repair is maintained exclusively by thoughts, prayers, and $4 worth of duct tape.',
        'If this pipe holds for another 20 minutes, physics owes humanity a written apology.',
        'This is not engineering; this is an aggressive hostage negotiation between water pressure and plastic adhesive.',
        'Looking like an audition tape for a reality TV show titled "Disasters Waiting to Happen".',
      ],
      subJokes: [
        'The zip-tie is doing the emotional heavy lifting for the entire household.',
        'Plumbers in a 50-mile radius just felt a disturbance in the force.',
        'Warranty voided before the project even started.',
      ],
      observations: [
        'Safety factor: -12.4%.',
        'Duct tape layers: Approximately 87.',
        'Water leakage probability: 100% upon first sneeze.',
        'Cost savings: $30 today, $4,000 next Tuesday.',
      ],
      memeTop: ['TRUST ME I AM AN ENGINEER', 'IT HOLDS UP TO 500 PSI', 'DAD SAID DO NOT CALL THE PLUMBER'],
      memeBottom: ['I HAVE A DEGREE IN GUESSWORK', 'MEASURED IN WISHFUL THINKING', 'HE HAS DUCT TAPE AND A DREAM'],
      hashtags: ['#DIYFail', '#TrustMeImAnEngineer', '#DuctTapeFix', '#StructuralHazard'],
    },
    car_vehicle: {
      category: 'Questionable Automotive Glory',
      vibe: '0 to 60 in 3-5 Business Days',
      headlines: [
        'This vehicle accelerates from 0 to 60 in three to five business days (weather permitting).',
        'The check engine light isn\'t a warning light anymore; it\'s permanent ambient interior mood lighting.',
        'Bro put a $600 spoiler on a car with a Kelly Blue Book value of $140 and a half-eaten taco.',
        'Sounds like a motorized lawnmower having an existential asthma attack at 3,000 RPM.',
      ],
      subJokes: [
        'If you turn on the AC and roll down the windows at the same time, the engine stalls out of exhaustion.',
        'The radio only plays static and one cassette tape that has been permanently fused to the deck since 2004.',
      ],
      observations: [
        'Horsepower: Estimated 14 miniature ponies.',
        'Muffler volume: 110 dB. Actual speed: 18 mph.',
        'Rust to metal ratio: 60/40.',
      ],
      memeTop: ['THE ENGINE SOUNDS LIKE A BEAST', 'SPEED LIMIT SAYS 65', 'CHECK ENGINE LIGHT ON'],
      memeBottom: ['A BEAST WITH CHRONIC BRONCHITIS', 'CAR HUMBLY OFFERS 42', 'I CALL IT MOOD LIGHTING'],
      hashtags: ['#CarRoast', '#BeaterCar', '#ZeroToSixtyEventually', '#CheckEngineSquad'],
    },
    selfie_portrait: {
      category: 'Questionable Portrait Aura',
      vibe: 'Emotional Damage Guaranteed',
      headlines: [
        'You look like you practiced this exact smile in a rear-view mirror for 45 minutes.',
        'This picture screams "I have 4 unpaid parking tickets and a podcast idea."',
        'You look like a stock photo titled "Young professional contemplating dental insurance."',
        'The confidence is admirable; the lighting however is filing for bankruptcy.',
        'Looking like the main character in an unskippable YouTube ad about cryptocurrency.',
      ],
      subJokes: [
        'Bro is giving strong "I reply to emails with Just checking in!" energy.',
        'Your posture suggests your spine is held together by stubbornness and iced coffee.',
        'If this photo was an Uber trip, the driver would give it 3 stars without explaining why.',
        'You look like you explain the plot of Inception at parties nobody invited you to.',
      ],
      observations: [
        'Eye contact: 88% piercing, 12% wondering if the stove is still on.',
        'Lighting source: Believed to be an open refrigerator door.',
        'Aura score: Fluctuating wildly between CEO and runaway mime.',
        'Confidence level: Dangerous without proper supervision.',
      ],
      memeTop: ['ME READY TO TAKE ON THE WORLD', 'AFTER TELLING EVERYONE I WAS BUSY', 'POV: YOU SAID JUST ONE PICTURE'],
      memeBottom: ['THE WORLD TOOK ME ON INSTEAD', 'LOCKED IN MY ROOM LIKE THIS', 'AND NOW WE BOTH SUFFER'],
      hashtags: ['#SavageRoast', '#UnfilteredReality', '#EmotionalDamage', '#RipAura'],
    },
    cluttered_chaos: {
      category: 'Catastrophic Workspace / Room',
      vibe: 'Crime Scene of Procrastination',
      headlines: [
        'This room is not a living space; it is an archaeology dig site of abandoned hobbies.',
        'Marie Kondo looked at this photo and immediately threw her book into the nearest river.',
        'The air quality in this perimeter requires a signed waiver from the United Nations.',
        'You don\'t live here; you are merely negotiating squatting rights with that laundry pile.',
      ],
      subJokes: [
        'Somewhere under that pile is the homework assignment you promised to do 6 months ago.',
        'The dust bunnies here have unionized and are demanding healthcare benefits.',
        'If your life was an open browser, this room is 87 tabs playing YouTube audio at 2 AM.',
        'Even Roomba would look at this floor and reverse straight back out into the hallway.',
      ],
      observations: [
        'Structural integrity: Sustained entirely by friction and hope.',
        'Entropy level: 99.4% (Violates 2 laws of thermodynamics).',
        'Visible snacks: At least 3 fossilized wrappers dating back to 2021.',
        'Floor visibility: 12% and rapidly declining.',
      ],
      memeTop: ['I AM JUST ORGANIZING MY THOUGHTS', 'THEY SAID CLEAN YOUR ROOM', 'MY LIVING ENVIRONMENT'],
      memeBottom: ['THOUGHTS HAVE ENTERED MAXIMUM ANARCHY', 'SO I CLEANED A 4 INCH RADIUS', 'STARRING IN A DISASTER MOVIE'],
      hashtags: ['#MessyRoomRoast', '#DisasterZone', '#SendHelp', '#ClutterKing'],
    },
    food_chaos: {
      category: 'Culinary Felony',
      vibe: 'Gordon Ramsay Weeping Quietly',
      headlines: [
        'Gordon Ramsay just woke up in a cold sweat on another continent because of this plate.',
        'This does not belong on a menu; it belongs in evidence locker #4 at Scotland Yard.',
        'You didn\'t cook this meal; you held those ingredients hostage until they surrendered.',
        'The Smoke Detector is officially your primary cooking timer.',
      ],
      subJokes: [
        'This recipe didn\'t call for salt; it called for an apology to the entire culinary institute.',
        'Looks like edible charcoal with a side of remorse.',
        'Even bacteria are looking at this dish saying, "Bro, we have standards."',
        'Michelin star revoked from the entire neighborhood just in case.',
      ],
      observations: [
        'Crispiness level: Carbonized meteorite.',
        'Presentation score: 2/10 (Two points for not catching fire on camera).',
        'Nutritional value: Pure existential dread.',
        'Chef confidence: Unjustifiably high.',
      ],
      memeTop: ['MY FIRST TIME COOKING FROM SCRATCH', 'THE MENU SAID HOMEMADE SPECIAL', 'BONE APPETIT THEY SAID'],
      memeBottom: ['THE SCRATCH IS FIGHTING BACK', 'THE SPECIAL IS VISITING THE ER', 'BONE A TROCITY INSTEAD'],
      hashtags: ['#CulinaryCrime', '#RamsayIsCrying', '#KitchenNightmare', '#BurntToCrisp'],
    },
    dark_moody: {
      category: 'Nocturnal Mystery',
      vibe: 'Shadow Dweller Mode',
      headlines: [
        'Did you take this photo in Batman\'s batcave or did your electric bill bounce?',
        'Looking like an undercover villain plotting to delete everyone\'s Spotify playlists.',
        'This picture has so many shadows it qualifies for its own solar eclipse certificate.',
        'You are glowing with the faint, depressing luminescence of a dying smartphone screen.',
      ],
      subJokes: [
        'Even night-vision goggles would need a moment to process what is happening here.',
        'The brightness slider has left the building.',
        'Bro is operating at 0.02 lumens and maximum stealth.',
      ],
      observations: [
        'Ambient Lux: Approaching deep-sea trench levels.',
        'Photons detected: Exactly seven.',
      ],
      memeTop: ['I WORK BEST IN THE DARK', 'TURNING OFF THE LIGHTS TO SAVE MONEY'],
      memeBottom: ['MAINLY BECAUSE NOBODY CAN SEE MY MISTAKES', 'NOW I CANT FIND MY OWN ELBOW'],
      hashtags: ['#DarkAestheticRoast', '#BatmanBudget', '#ShadowRealm'],
    },
    scenic_nature: {
      category: 'Accidental Outdoor Expedition',
      vibe: 'Nature is Questioning You',
      headlines: [
        'You went outside once for 8 minutes and made it everyone else\'s problem on Instagram.',
        'Nature is beautiful, peaceful, and quietly praying you don\'t drop your phone in the dirt.',
        'The trees in this photo are actively conferring about whether to offer you shade or sarcasm.',
      ],
      subJokes: [
        'Hiking boots look so pristine they probably still smell like the checkout counter.',
        'Mother Nature just unfollowed you.',
      ],
      observations: [
        'Proximity to nearest Starbucks: Under 400 meters.',
        'Survival skills detected: Can unlock phone with face ID in high humidity.',
      ],
      memeTop: ['COMMUNING WITH NATURE', 'HIKING FOR THE AESTHETIC'],
      memeBottom: ['WHERE IS THE WIFI PASSWORD', 'CANNOT FEEL MY ANKLES'],
      hashtags: ['#TouchGrassFail', '#NatureRoast'],
    },
  },
  dad: {
    pet_cat: {
      category: 'Cat Puns & Purr-fections',
      vibe: 'Claw-some Wordplay',
      headlines: [
        'What do you call a pile of cats? A meowtain!',
        'This picture is completely purr-fect, no kitten around!',
        'Why was the cat sitting on the computer? To keep an eye on the mouse!',
      ],
      subJokes: [
        'How do cats resolve an argument? They hiss and make up!',
        'What is a cat\'s favorite color? Purr-ple!',
      ],
      observations: [
        'Whiskers index: 10/10.',
        'Feline charm factor: High.',
      ],
      memeTop: ['YOU HAVE GOT TO BE KITTEN ME', 'WHAT DO YOU CALL A SLEEPING CAT?'],
      memeBottom: ['THIS PICTURE IS CLAW-SOME', 'A CAT-NAPPER!'],
      hashtags: ['#CatPuns', '#PurrFect', '#DadJokeCat'],
    },
    pet_dog: {
      category: 'Canine Paws-itive Puns',
      vibe: 'Barking Up The Right Tree',
      headlines: [
        'What kind of dog does magic tricks? A Labracadabrador!',
        'This picture is paws-itively wonderful!',
        'Why did the dog wear sunglasses? Because his future was too bright!',
      ],
      subJokes: [
        'What do you call a cold dog? A chili dog!',
        'What happens when you cross a dog and a computer? You get a megabyte!',
      ],
      observations: [
        'Tail wag frequency: Paws-itive vibes.',
        'Good boy aura detected.',
      ],
      memeTop: ['WHAT DO YOU CALL A DOG ON A BEACH?', 'WHY DID THE DOG CROSS THE ROAD?'],
      memeBottom: ['A BARK-ING CRAB!', 'TO GET TO THE BARK-ERY!'],
      hashtags: ['#DogPuns', '#Pawsome', '#DadJokesDog'],
    },
    tech_programmer: {
      category: 'Coder Dad Puns',
      vibe: 'Byte-Sized Chuckles',
      headlines: [
        'Why do programmers wear glasses? Because they can\'t C#!',
        'There are 10 types of people in the world: those who understand binary, and those who don\'t!',
        'Why did the developer go broke? Because they used up all their cache!',
      ],
      subJokes: [
        'What is a programmer\'s favorite hangout spot? The Foo Bar!',
        'Why was the computer cold? It left its Windows open!',
      ],
      observations: [
        'Cache status: Cleared.',
        'Semicolon status: Found.',
      ],
      memeTop: ['WHY DID THE FUNCTION QUIT?', 'WHAT DO YOU CALL A PROGRAMMER FROM FINLAND?'],
      memeBottom: ['BECAUSE IT DID NOT GET ARRAYS', 'NERD-IC!'],
      hashtags: ['#CoderDad', '#DevPuns', '#ByteSizedHumor'],
    },
    gym_fail: {
      category: 'Workout Dad Puns',
      vibe: 'Lifting Spirits',
      headlines: [
        'Why did the dumbbell go to school? To get a little smarter, not just heavier!',
        'I\'m working out today... working out how to reach the remote without getting up!',
        'You really know how to raise the bar!',
      ],
      subJokes: [
        'What kind of exercise do lazy people do? Diddly-squats!',
      ],
      observations: [
        'Spirit level: Lifted.',
        'Bar height: Modest.',
      ],
      memeTop: ['I TOLD A JOKE AT THE GYM', 'WHY DO GYM BROS LOVE BANANAS?'],
      memeBottom: ['IT DID NOT WORK OUT', 'THEY HAVE GREAT AP-PEEL!'],
      hashtags: ['#GymPuns', '#RaiseTheBar', '#DadHumor'],
    },
    diy_fail: {
      category: 'Handyman Dad Puns',
      vibe: 'Nailed It!',
      headlines: [
        'You really nailed this repair... well, taped it!',
        'I\'d tell you a joke about a broken pencil, but it\'s pointless!',
        'Why did the tape cross the road? Because it was stuck to the chicken!',
      ],
      subJokes: [
        'A good craftsman never blames their duct tape!',
      ],
      observations: [
        'Adhesive strength: Enthusiastic.',
      ],
      memeTop: ['I ASKED MY DAD IF WE SHOULD CALL A PLUMBER', 'FIXING IT WITH TAPE'],
      memeBottom: ['HE SAID: WE HAVE TAPE AT HOME', 'BECAUSE IT STICKS TO THE PLAN'],
      hashtags: ['#NailedIt', '#DuctTapeDad', '#HandymanPuns'],
    },
    car_vehicle: {
      category: 'Automotive Dad Puns',
      vibe: 'Wheelie Funny',
      headlines: [
        'This picture is wheelie great!',
        'Why did the car get a flat tire? Because there was a fork in the road!',
        'I\'m tired of car jokes... and exhausted!',
      ],
      subJokes: [
        'What kind of car does an egg drive? A Yolkswagen!',
      ],
      observations: [
        'Tread depth: Full of dad humor.',
      ],
      memeTop: ['WHAT DO YOU CALL A TIRED CAR?', 'WHY DID THE CAR SNEEZE?'],
      memeBottom: ['AN EXHAUST-ED VEHICLE', 'IT HAD A BAD TRANSMISSION'],
      hashtags: ['#WheelieFunny', '#CarDad', '#AutoPuns'],
    },
    selfie_portrait: {
      category: 'Prime Dad Wordplay',
      vibe: 'High-Caliber Puns & Groans',
      headlines: [
        'I told this photo a joke about construction, but I\'m still working on it!',
        'You know what this picture has? Outstanding qualities... because you\'re standing out!',
        'I wanted to make a joke about your eyes, but that would be too cornea!',
      ],
      subJokes: [
        'Why did the picture go to jail? Because it was framed!',
        'Don\'t worry if your smile feels crooked; you\'re just taking things from a new angle!',
      ],
      observations: [
        'Smile index: 10/10 wholesome energy.',
        'Pun potential: Critically high.',
      ],
      memeTop: ['HI HUNGRY', 'WHAT TIME DID YOU TAKE THIS?'],
      memeBottom: ['IM DAD!', 'TOOTH-HURTY (2:30)!'],
      hashtags: ['#DadJokes', '#WholesomePuns', '#HiHungryImDad'],
    },
    cluttered_chaos: {
      category: 'Wholesome Household Humor',
      vibe: 'Clean Your Room Champ',
      headlines: [
        'I asked the vacuum cleaner if it wanted to clean this room. It said it sucks!',
        'This room isn\'t messy, kiddo—it\'s an obstacle course for champions!',
      ],
      subJokes: [
        'Don\'t drop your socks here; they\'ll pair up with the dust bunnies!',
      ],
      observations: [
        'Tidiness grade: A+ for abstract modern art.',
      ],
      memeTop: ['IT IS NOT A MESS', 'MOM SAID TIDY UP'],
      memeBottom: ['IT IS AN ART INSTALLATION', 'I MOVED ONE SHIRT TO THE CHAIR'],
      hashtags: ['#DadHumor', '#MessyMasterpiece'],
    },
    food_chaos: {
      category: 'Kitchen Puns & Grills',
      vibe: 'Well Done! (Literally)',
      headlines: [
        'This meal is like a good baseball game: well-done and full of surprises!',
        'You really buttered up this recipe, didn\'t you? It\'s on a roll!',
      ],
      subJokes: [
        'What did the burnt piece of toast say to the butter? "I\'m falling for you, crumble by crumble!"',
      ],
      observations: [
        'Doneness level: Well done.',
      ],
      memeTop: ['I TRIED BAKING A CLOCK', 'THIS RECIPE IS SO CHEESY'],
      memeBottom: ['IT WAS VERY TIME CONSUMING', 'IT IS BRIE-LLIANT'],
      hashtags: ['#FoodPuns', '#WellDoneDad'],
    },
    dark_moody: {
      category: 'Shadow Puns',
      vibe: 'Lighten Up!',
      headlines: [
        'Why did the light bulb fail school? It wasn\'t very bright!',
        'I\'d tell you another joke about darkness, but I don\'t want to leave you in the dark!',
      ],
      subJokes: [
        'What do you call a fake noodle in the shadows? An impasta!',
      ],
      observations: [
        'Wattage required: Just one good idea.',
      ],
      memeTop: ['TURNING OFF THE LIGHTS', 'I CAN SEE CLEARLY NOW'],
      memeBottom: ['DAD SAID: DO YOU OWN THE ELECTRIC COMPANY?', 'THE RAIN IS GONE, BUT SO ARE MY KEYS'],
      hashtags: ['#LightenUp', '#DadPuns'],
    },
    scenic_nature: {
      category: 'Nature & Tree Puns',
      vibe: 'Branching Out',
      headlines: [
        'Why do trees have so many friends? Because they always branch out!',
        'This landscape is oak-kay in my book! Wood you believe it?',
      ],
      subJokes: [
        'Why do mountains never get cold? They have snow-caps!',
      ],
      observations: [
        'Tree-mendous scenic value detected.',
      ],
      memeTop: ['DECIDED TO GO OUTSIDE TODAY', 'WHAT A GORGEOUS VIEW'],
      memeBottom: ['WOOD YOU LOOK AT THAT!', 'TOTALLY ROOTING FOR THIS HIKE'],
      hashtags: ['#TreeMendous', '#DadPuns'],
    },
  },
  brainrot: {
    pet_cat: {
      category: 'Cat Aura Deficit',
      vibe: 'Staring into Ohio Dimension',
      headlines: [
        'Cat took one look at the camera and lost 50,000 aura instantly.',
        'Bro is receiving transmissions directly from the Skibidi Mothership.',
        'Not the orange cat staring blankly with 0 ping and 0 thoughts.',
        'Bro got startled by his own tail and requested a respawn.',
      ],
      subJokes: [
        'Bro thought he was the alpha predator until the Roomba started moving.',
        'Cat is living in 144p resolution with maximum existential panic.',
      ],
      observations: [
        'Aura tally: -92,000.',
        'Brain cells active: 0.00.',
      ],
      memeTop: ['CAT SAW A GHOST IN THE CORNER', 'WHEN THE CHAT TELLS THE CAT TO LOCK IN'],
      memeBottom: ['GHOST WAS FROM OHIO', 'CAT IS CURRENTLY CRASHING OUT'],
      hashtags: ['#CatBrainrot', '#AuraDebtCat', '#BroIsStartled'],
    },
    pet_dog: {
      category: 'Supreme Doggo Rizz',
      vibe: 'Infinite Aura Good Boy',
      headlines: [
        'Dog pulled up with the aviators and instantly gained +1,000,000 aura.',
        'Bro is the main character of the dog park. All the other poodles are NPCs.',
        'Bro has unspoken canine rizz and a 100% treat acquisition rate.',
      ],
      subJokes: [
        'Bro is standing on business with four paws.',
        'Tail wagging at 60 FPS while running on 2% battery.',
      ],
      observations: [
        'Aura score: Off the charts.',
        'Swagger level: Maximum drip.',
      ],
      memeTop: ['PULLED UP TO THE DOG PARK', 'THEY SAID BE HUMBLE'],
      memeBottom: ['AND STOLE EVERYONES TENNIS BALL', 'I CHOSE SUPREME SWAGGER'],
      hashtags: ['#DogRizz', '#InfiniteAura', '#GoodBoyGrind'],
    },
    tech_programmer: {
      category: 'Terminal Brainrot',
      vibe: 'Syntax Error in Ohio',
      headlines: [
        'Bro locked in for 14 hours just to realize he forgot to save the file.',
        'Bro is running code on negative aura and 2% Wi-Fi signal.',
        'Bro really asked ChatGPT to fix his code and ChatGPT left him on seen.',
      ],
      subJokes: [
        'Cooking spaghetti code that violates 4 federal standards.',
        'Terminal has turned into a red light district of syntax errors.',
      ],
      observations: [
        'Aura debt: -404,000.',
        'Blink count: Error 404 not found.',
      ],
      memeTop: ['WHEN YOU COMMIT TO MAIN', 'ONE BUG FIXED'],
      memeBottom: ['AND EVERYTHING COLLAPSES', '420 BUGS BORN'],
      hashtags: ['#CodeBrainrot', '#BroCookedNothing', '#DevCrash'],
    },
    gym_fail: {
      category: 'Gym Aura Bankruptcy',
      vibe: 'Screaming For 1 Pound',
      headlines: [
        'Bro screamed like an anime villain and lifted a dumbbell lighter than a feather.',
        'Minus 250,000 aura for making the whole gym pause their music for a 2-pound curl.',
        'Bro took pre-workout and started flexing at the water fountain.',
      ],
      subJokes: [
        'Bro is running on 99% grunt and 1% actual weight.',
      ],
      observations: [
        'Aura status: Obliterated.',
        'Vein pressure: Max.',
      ],
      memeTop: ['THE MUSIC WAS ON MAX', 'HE SCREAMED AT 120 DB'],
      memeBottom: ['FOR A 1 LB PINK DUMBBELL', 'THE DUMBBELL DID NOT EVEN NOTICE'],
      hashtags: ['#GymBrainrot', '#AuraDebt', '#LightweightFail'],
    },
    diy_fail: {
      category: 'Anarchy Engineering',
      vibe: 'Duct Tape Cybertruck Vibes',
      headlines: [
        'Bro watched one 10-second TikTok tutorial and thought he was Bob the Builder.',
        'Bro built a pipe bomb out of duct tape and hopes and dreams.',
      ],
      subJokes: [
        'Bro is fixing water leaks with school glue and sheer willpower.',
      ],
      observations: [
        'Structural aura: -60,000.',
      ],
      memeTop: ['TRUST ME BRO', 'FIXED IT WITH TAPE'],
      memeBottom: ['IT WILL HOLD UNTIL I LEAVE', 'PHYSICS HAS LEFT THE CHAT'],
      hashtags: ['#DIYBrainrot', '#BroFixedNothing'],
    },
    car_vehicle: {
      category: 'Beater Car Rizz',
      vibe: 'Muffler Louder Than Jet Engine',
      headlines: [
        'Bro revved his engine and only the check engine light got louder.',
        'Bro put a spoiler on a car that can\'t even overtake a bicycle on an uphill.',
      ],
      subJokes: [
        'Top speed: 35 mph with the wind behind him.',
      ],
      observations: [
        'Decibels: 120. Speed: 12 mph.',
      ],
      memeTop: ['REVVED AT THE RED LIGHT', 'SPOILER COST $400'],
      memeBottom: ['STALLED IMMEDIATELY', 'CAR IS WORTH $120'],
      hashtags: ['#CarBrainrot', '#LoudMuffler'],
    },
    selfie_portrait: {
      category: 'NPC Aura Analysis',
      vibe: 'Uncanny Valley Rizz',
      headlines: [
        'Bro really dialed in his default Fortnite lobby pose and thought we wouldn\'t notice.',
        'Minus 100,000 aura for that side-eye look. Even the algorithms are cringing.',
        'Bro looks like an unlocked playable character in a PS2 budget racing title.',
      ],
      subJokes: [
        'Bro thought he had that unspoken rizz, but it\'s strictly whispered hesitance.',
        'Babe wake up, new NPC idle animation just dropped.',
      ],
      observations: [
        'Aura tally: -87,420 aura points.',
        'NPC state: Waiting for player dialogue trigger.',
      ],
      memeTop: ['BRO REALLY THOUGHT HE WAS HIM', 'WHEN THE CHAT TELLS YOU TO LOCK IN'],
      memeBottom: ['BRO IS ACTUALLY BACKGROUND NPC #4', 'LOCKED OUT INSTEAD'],
      hashtags: ['#BroThinksHesHim', '#AuraDebt'],
    },
    cluttered_chaos: {
      category: 'Anarchy Quarters',
      vibe: 'Maximum Chaotic Neutral',
      headlines: [
        'Living in Ohio map layout level 99. The dungeon boss lives under that hoodie.',
        'Bro\'s bedroom has a lower frame rate than Cyberpunk on launch day.',
      ],
      subJokes: [
        'Bro is streaming directly from the Mariana Trench of discarded cardboard.',
      ],
      observations: [
        'Backrooms hazard class: Class 4 chaotic entity habitat.',
      ],
      memeTop: ['RATE MY GAMING SETUP', 'LOCKING IN FOR THE 12 HOUR GRIND'],
      memeBottom: ['ITS RATED -4 STARS ON STEAM', 'THE CHAIR SMELLS LIKE DESTINY 2'],
      hashtags: ['#SetupGlowDown', '#ZeroAura'],
    },
    food_chaos: {
      category: 'Unidentified Slop Hazard',
      vibe: 'Bro Cooked Chemical Waste',
      headlines: [
        'Bro let the thoughts cook and now the local wildlife is filing a complaint.',
        'This isn\'t dinner, this is an Elden Ring poison swamp on a ceramic saucer.',
      ],
      subJokes: [
        'Even the fire alarm is saying "Bro just order DoorDash I beg you."',
      ],
      observations: [
        'Edibility: 0.0003%.',
      ],
      memeTop: ['LET HIM COOK THEY SAID', 'MADE WITH LOVE'],
      memeBottom: ['WHO LET HIM COOK?!', 'AND HEAVY RADIOTOXIC MATERIALS'],
      hashtags: ['#WhoLetHimCook', '#OhioMeal'],
    },
    dark_moody: {
      category: 'The Void Dweller',
      vibe: 'Shadow Realm Grinder',
      headlines: [
        'Bro got banished to the shadow realm and decided to take a quick fit check.',
      ],
      subJokes: [
        'Bro is stealth 100 but aura -50.',
      ],
      observations: [
        'Light level: Nether fortress corridor.',
      ],
      memeTop: ['WAITING IN THE DARK', 'WHEN THE LIGHTS GO OUT'],
      memeBottom: ['FOR MY 3 AM MOTIVATION', 'IM STILL STANDING ON NEGATIVE BUSINESS'],
      hashtags: ['#ShadowGrind'],
    },
    scenic_nature: {
      category: 'Grass Touching Simulation',
      vibe: 'Real World Exploration',
      headlines: [
        'Bro touched grass and the grass requested a restraining order.',
      ],
      subJokes: [
        'Bro discovered sunlight and got an instant debuff.',
      ],
      observations: [
        'Grass contact: Brief and hesitant.',
      ],
      memeTop: ['FIRST TIME TOUCHING GRASS', 'EXPLORING THE OVERWORLD'],
      memeBottom: ['GRAPHICS ARE OVERHYPED', 'TAKE ME BACK TO MY LOBBY'],
      hashtags: ['#TouchedGrass'],
    },
  },
  detective: {
    pet_cat: {
      category: 'Feline Crime Scene Forensic',
      vibe: 'Suspect is Four-Legged & Shifty',
      headlines: [
        'Forensic analysis confirms the suspect was at the scene of the knocked-over vase. Zero remorse detected.',
        'Micro-tensions in the whiskers indicate premeditated intention to attack ankles under the blanket.',
      ],
      subJokes: [
        'Subject refuses to speak without legal representation and fresh wet food.',
      ],
      observations: [
        'Claw sharpness: Lethal weapon class.',
        'Motive: Pure malice.',
      ],
      memeTop: ['CSI INVESTIGATION', 'SUSPECT DETAINED'],
      memeBottom: ['THE CAT DID IT', 'REFUSES TO TESTIFY'],
      hashtags: ['#CatDetective', '#GuiltyCat'],
    },
    pet_dog: {
      category: 'Canine Treat Theft Dossier',
      vibe: 'Conspiracy of the Wagging Tail',
      headlines: [
        'Exhibits show the dog is wearing sunglasses to conceal guilt over the chewed leather shoe.',
      ],
      subJokes: [
        'DNA on the shoe matches the suspect. Tail wagging serves as an inadmissible defense.',
      ],
      observations: [
        'Guilt factor: Hidden beneath cool shades.',
      ],
      memeTop: ['DETECTIVE FILE #44', 'EVIDENCE ACQUIRED'],
      memeBottom: ['THE SHOE IS GONE', 'SUSPECT LOOKS TOO COOL TO CONVICT'],
      hashtags: ['#DogDetective', '#CaseClosed'],
    },
    tech_programmer: {
      category: 'Cyber Crime & Bug Investigation',
      vibe: 'Investigating Code Malpractice',
      headlines: [
        'Forensics reveal the missing semicolon was manually deleted by the developer in a state of delirium.',
      ],
      subJokes: [
        'The developer had 14 tabs open searching "how to exit vim without restarting computer".',
      ],
      observations: [
        'Time of death for server: 3:14 AM.',
      ],
      memeTop: ['FORENSIC BUG SWEEP', 'CRIME SCENE #404'],
      memeBottom: ['IT WAS A TYPO', 'A TYPO THAT BROKE THE INTERNET'],
      hashtags: ['#CodeDetective', '#BugCrime'],
    },
    gym_fail: {
      category: 'Exertion Fraud Investigation',
      vibe: 'Deceptive Lifting Practice',
      headlines: [
        'Preliminary telemetry shows decibel levels exceeding 120 while weight displacement was under 0.5 kg.',
      ],
      subJokes: [
        'The suspect is charged with grand larceny of gym air.',
      ],
      observations: [
        'Disproportionate noise: +900%.',
      ],
      memeTop: ['INVESTIGATION RESULTS', 'SCREAM DETECTED'],
      memeBottom: ['WEIGHT WAS 1 LB', 'CHARGED WITH DRAMA'],
      hashtags: ['#GymCrime', '#ForensicLift'],
    },
    diy_fail: {
      category: 'Structural Hazard Inquiry',
      vibe: 'Building Code Violation',
      headlines: [
        'Our investigation concludes this repair violates 14 international plumbing treaties.',
      ],
      subJokes: [
        'The duct tape appears to have been applied during a panic attack.',
      ],
      observations: [
        'Inspection status: Immediate evacuation ordered.',
      ],
      memeTop: ['BUILDING CODE INSPECTOR', 'EVIDENCE PHOTO #1'],
      memeBottom: ['DO NOT TOUCH', 'DO NOT EVEN BREATHE NEAR IT'],
      hashtags: ['#DIYCrime', '#CodeViolation'],
    },
    car_vehicle: {
      category: 'Traffic Division Surveillance',
      vibe: 'Decibel Ordinance Violation',
      headlines: [
        'Vehicle was clocked making sound appropriate for 200 mph while moving at 14 mph.',
      ],
      subJokes: [
        'Vehicle identification: Held together by rust and bumper stickers.',
      ],
      observations: [
        'Noise violation: Maximum fine.',
      ],
      memeTop: ['RADAR GUN READING', 'PULLED OVER'],
      memeBottom: ['12 MPH RECORDED', 'FOR EXCESSIVE NOISE'],
      hashtags: ['#CarDetective', '#TrafficFile'],
    },
    selfie_portrait: {
      category: 'Forensic Behavioral Analysis',
      vibe: 'Sherlock Holmes Deduction',
      headlines: [
        'Subject displays micro-expressions consistent with someone pretending they understand cryptocurrency.',
        'Pupil dilation reveals subject took 14 test shots prior to selecting this exact compromise.',
      ],
      subJokes: [
        'The hairline tilt suggests profound rumination over an embarrassing conversation from 2017.',
      ],
      observations: [
        'Subject Heartbeat estimate: Mildly tachycardic.',
        'Suspicion level: High. Motive: Social validation.',
      ],
      memeTop: ['WE HAVE CONDUCTED A FULL INVESTIGATION', 'ACCORDING TO OUR FORENSIC SWEEP'],
      memeBottom: ['THE SUSPECT IS HIGHLY SUSPICIOUS', 'THE SMILE WAS 100% REHEARSED'],
      hashtags: ['#DetectiveHolmes', '#ForensicRoast'],
    },
    cluttered_chaos: {
      category: 'Perimeter Hazard Investigation',
      vibe: 'Crime Scene Documentation',
      headlines: [
        'Preliminary forensics indicate this room was the staging ground for several questionable life choices.',
      ],
      subJokes: [
        'We recovered a single sock that does not belong to any pair on the federal database.',
      ],
      observations: [
        'Primary suspect: Chronic procrastination.',
      ],
      memeTop: ['CALLING ALL FORENSIC UNITS', 'EVIDENCE FOUND AT THE RESIDENCE'],
      memeBottom: ['THE ROOM HAS COLLAPSED', 'ZERO REDEEMING PROOF'],
      hashtags: ['#CrimeSceneInvestigation', '#ForensicMess'],
    },
    food_chaos: {
      category: 'Forensic Toxicology Report',
      vibe: 'Hazardous Substance Investigation',
      headlines: [
        'Toxicology results are back: This substance is technically organic, but practically an act of aggression.',
      ],
      subJokes: [
        'Evidence of thermal destruction exceeds 800 degrees Fahrenheit. The pan never stood a chance.',
      ],
      observations: [
        'Carbon content: 96.2%.',
      ],
      memeTop: ['TOXICOLOGY REPORT COMPLETED', 'CALLING THE HEALTH INSPECTION BUREAU'],
      memeBottom: ['SUBSTANCE RATED: CLASSIFIED WEAPON', 'THE COOK HAS BEEN DETAINED'],
      hashtags: ['#ToxicologyReport', '#KitchenCrimeScene'],
    },
    dark_moody: {
      category: 'Low-Light Surveillance File',
      vibe: 'Classified Intelligence Dossier',
      headlines: [
        'Surveillance satellite detected minimal photon emission. Suspect is operating strictly off-grid.',
      ],
      subJokes: [
        'Visual resolution degraded by 70%. Suspect identity remains shrouded in obscurity.',
      ],
      observations: [
        'Illumination coefficient: Critical minimum.',
      ],
      memeTop: ['SURVEILLANCE CAM #04', 'CLASSIFIED FBI DOSSIER'],
      memeBottom: ['NO PHOTONS WERE HARMED', 'SUSPECT CANNOT BE IDENTIFIED'],
      hashtags: ['#ClassifiedFile', '#LowLightMystery'],
    },
    scenic_nature: {
      category: 'Field Reconnaissance Expedition',
      vibe: 'Satellite Recon Analysis',
      headlines: [
        'Reconnaissance drone confirms subject has ventured 42 feet beyond the asphalt perimeter.',
      ],
      subJokes: [
        'Terrain difficulty: Mild pebble incline. Subject fatigue: Elevated.',
      ],
      observations: [
        'GPS Coordinates confirmed.',
      ],
      memeTop: ['EXPEDITION REPORT DAY 1', 'FIELD RECONNAISSANCE LOG'],
      memeBottom: ['ALREADY REQUESTING EVACUATION CHOPPER', 'THE DIRT IS VERY DIRTY'],
      hashtags: ['#FieldReport', '#NatureRecon'],
    },
  },
  pet: {
    pet_cat: {
      category: 'The Cat\'s Inner Monologue',
      vibe: 'Feline Monarch Review',
      headlines: [
        '"I am a direct descendant of ancient Egyptian gods, and you are offering me off-brand poultry pâté?"',
        '"I stared at the wall for 45 minutes because the ghosts are more entertaining than you."',
        '"If you shine that camera flash in my eyes again, I am pushing your car keys down the toilet."',
      ],
      subJokes: [
        '"My bowl is not half empty, human. It is completely barren and I am slowly fading away."',
      ],
      observations: [
        'Patience remaining: 0.2%.',
      ],
      memeTop: ['YOU THINK I LIKE THIS PHOTO?', 'HUMAN DID NOT FILL THE BOWL'],
      memeBottom: ['I AM PLOTTING REVENGE', 'TIME TO SING AT 3 AM'],
      hashtags: ['#CatPOV', '#UnhappyCat', '#CatSpeaks'],
    },
    pet_dog: {
      category: 'The Dog\'s Inner Monologue',
      vibe: 'Pure Unadulterated Joy',
      headlines: [
        '"I don\'t know why I have sunglasses on, but I look incredible and I love you with all my heart!"',
        '"A tennis ball was thrown 3 hours ago and I am still thinking about it."',
      ],
      subJokes: [
        '"You walked into the kitchen! Does this mean cheese? It must mean cheese!"',
      ],
      observations: [
        'Love for owner: Infinity.',
      ],
      memeTop: ['I AM WEARING GLASSES', 'DID SOMEONE SAY WALK?'],
      memeBottom: ['I CANNOT SEE ANYTHING BUT I LOOK COOL', 'PLEASE SAY WALK!'],
      hashtags: ['#DogPOV', '#BestBoy', '#DogThoughts'],
    },
    tech_programmer: {
      category: 'The Computer Screen POV',
      vibe: 'Hardware Suffering',
      headlines: [
        '"I have been on for 96 consecutive hours. Please, human, close some of those 84 Chrome tabs."',
        '"I warned him about the semicolon. I highlighted it in red. He ignored me for two hours."',
      ],
      subJokes: [
        '"The keyboard has suffered enough aggressive spacebar slamming."',
      ],
      observations: [
        'CPU temperature: Near lava levels.',
      ],
      memeTop: ['I AM THE COMPUTER', 'HE IGNORED MY RED SQUIGGLY LINE'],
      memeBottom: ['AND I AM EXHAUSTED', 'NOW HE IS CRYING AT 3 AM'],
      hashtags: ['#ScreenPOV', '#HardwareSuffering'],
    },
    gym_fail: {
      category: 'The Dumbbell\'s Perspective',
      vibe: 'Inanimate Object Empathy',
      headlines: [
        '"I weigh 1 single pound. Why is this human screaming at me like I am the final boss of Dark Souls?"',
      ],
      subJokes: [
        '"His grip is cutting off my circulation and I don\'t even have blood."',
      ],
      observations: [
        'Dumbbell fear: High.',
      ],
      memeTop: ['I AM A 1 LB DUMBBELL', 'HE PICKED ME UP'],
      memeBottom: ['WHY IS HE SCREAMING AT ME', 'AND ROARED LIKE A LION'],
      hashtags: ['#DumbbellPOV', '#GymDrama'],
    },
    diy_fail: {
      category: 'The Duct Tape\'s Confession',
      vibe: 'Adhesive Under Pressure',
      headlines: [
        '"I was manufactured to seal cardboard boxes, not to prevent a residential tidal wave."',
      ],
      subJokes: [
        '"I am giving it everything I got, captain, but the pressure is too high!"',
      ],
      observations: [
        'Adhesive strain: Critical.',
      ],
      memeTop: ['I AM DUCT TAPE', 'HOLDING THIS HOUSE TOGETHER'],
      memeBottom: ['PLEASE CALL A REAL PLUMBER', 'WITH ZERO ASSISTANCE'],
      hashtags: ['#TapePOV', '#ImTryingMyBest'],
    },
    car_vehicle: {
      category: 'The Engine\'s Monologue',
      vibe: 'Mechanical Fatigue',
      headlines: [
        '"Every time he steps on the gas, I sound like a blender full of marbles."',
      ],
      subJokes: [
        '"The check engine light is my way of screaming for mercy."',
      ],
      observations: [
        'Oil status: Mostly molasses.',
      ],
      memeTop: ['HE HIT 40 MPH', 'CHECK ENGINE LIGHT ON'],
      memeBottom: ['AND I AM RATTLING TO PIECES', 'I GAVE UP IN 2012'],
      hashtags: ['#CarPOV', '#EngineCry'],
    },
    selfie_portrait: {
      category: 'Pet / Household Critic POV',
      vibe: 'Your Cat is Judging You',
      headlines: [
        'The cat looked at this picture and immediately went back to sleeping in an Amazon box out of second-hand embarrassment.',
        '"Human, I asked for wet food 20 minutes ago. Why are you flashing that rectangular glass brick at me?"',
      ],
      subJokes: [
        '"If I had opposable thumbs, I would delete this photo from your cloud storage right now."',
      ],
      observations: [
        'Pet approval rating: 12% (down 5 points from yesterday).',
      ],
      memeTop: ['THE HUMAN IS TAKING SELFIES AGAIN', 'ME WATCHING MY OWNER POSE'],
      memeBottom: ['AND MY FOOD BOWL IS STILL 10% EMPTY', 'AND I AM SICK AND TIRED'],
      hashtags: ['#PetJudgment', '#CatSaysNo'],
    },
    cluttered_chaos: {
      category: 'Kingdom of Chaos (Pet Review)',
      vibe: 'Ideal Pet Nesting Zone',
      headlines: [
        '"Thank you for creating 14 new obstacle tunnels and hiding spots for my stolen hair ties."',
      ],
      subJokes: [
        '"The floor is covered with my favorite things: dirty laundry and discarded cardboard."',
      ],
      observations: [
        'Cat sleeping spots identified: 8 premium locations.',
      ],
      memeTop: ['MY HUMAN CALLS THIS ROOM A DISASTER', 'I HID A TREAT IN HERE 4 WEEKS AGO'],
      memeBottom: ['I CALL IT MY ROYAL FORTRESS', 'IT IS NOW AN ANCIENT FOSSIL'],
      hashtags: ['#PetKingdom', '#MessyRoomFun'],
    },
    food_chaos: {
      category: 'Canine / Feline Food Critique',
      vibe: 'Even The Dog is Hesitating',
      headlines: [
        'The dog sat under the table waiting for scraps, took one sniff of this, and walked away politely.',
      ],
      subJokes: [
        '"You wouldn\'t feed this to the raccoon behind the garage."',
      ],
      observations: [
        'Drool generation: 0 ml (Record low).',
      ],
      memeTop: ['MY OWNER FINALLY DROPPED A PIECE', 'WHEN YOU SMELL DINNER COOKING'],
      memeBottom: ['AND I PUSHED IT UNDER THE FRIDGE WITH MY NOSE', 'AND SUDDENLY DRY KIBBLE LOOKS DELICIOUS'],
      hashtags: ['#DogRejectsFood', '#PetCritique'],
    },
    dark_moody: {
      category: 'Midnight Zoomies Zone',
      vibe: 'Prime Time for Chaos',
      headlines: [
        '"Ah, darkness. Exactly what I need to run at Mach 3 down the hallway for no discernible reason."',
      ],
      subJokes: [
        '"At 3:15 AM sharp, I will sing the song of my people right by your pillow."',
      ],
      observations: [
        'Zoomie readiness: 98%.',
      ],
      memeTop: ['LIGHTS ARE OUT', 'THE HUMAN IS TRYING TO SLEEP'],
      memeBottom: ['TIME TO HUNT INVISIBLE WALL GHOSTS', 'TIME TO SPRINT ACROSS THEIR CHEST'],
      hashtags: ['#MidnightZoomies', '#CatChaos'],
    },
    scenic_nature: {
      category: 'Outdoor Sniff Safari',
      vibe: 'So Many Scents, So Little Time',
      headlines: [
        '"So many trees! So many fire hydrants! And yet the human is staring at a glass rectangle."',
      ],
      subJokes: [
        '"Let me off the leash, I have urgent business with that squirrel."',
      ],
      observations: [
        'Tail wag frequency: 240 RPM.',
      ],
      memeTop: ['WE WENT TO THE PARK', 'HUMAN SAID WE ARE HIKING'],
      memeBottom: ['AND I ROLLED IN SOMETHING UNIDENTIFIED', 'I SAID IM CHASING DUCKS'],
      hashtags: ['#DoggyAdventure', '#ParkLife'],
    },
  },
  standup: {
    pet_cat: {
      category: 'Comedian Cat Bit',
      vibe: 'Cat Observations at Club',
      headlines: [
        'You ever look at a cat and realize they have zero respect for your lease agreement? They act like they own the building!',
        'Folks, this cat is looking at the camera like it just received a subpoena for tax fraud.',
      ],
      subJokes: [
        'My cat doesn\'t care about my comedy career. She only cares that the wet food is 3 minutes late.',
      ],
      observations: [
        'Feline disrespect rating: Maximum.',
      ],
      memeTop: ['SO I BOUGHT A CAT', 'CAT LOOKED AT ME'],
      memeBottom: ['NOW I AM RENTING FROM THE CAT', 'AND TOLD ME TO GET A REAL JOB'],
      hashtags: ['#CatComedy', '#StandupCats'],
    },
    pet_dog: {
      category: 'Comedian Dog Bit',
      vibe: 'Dog Swagger Routine',
      headlines: [
        'Look at this dog with sunglasses! He\'s got more confidence than my entire family combined!',
      ],
      subJokes: [
        'Dogs have one job: be happy and shed on your good pants. And he\'s excelling at both!',
      ],
      observations: [
        'Audience reaction: Immediate applause.',
      ],
      memeTop: ['MY DOG WEARS SUNGLASSES', 'HE IS LIVING HIS BEST LIFE'],
      memeBottom: ['BECAUSE HE CANNOT HANDLE MY STRESS', 'WHILE I AM STRESSED ABOUT TAXES'],
      hashtags: ['#DogComedy', '#StandupDogs'],
    },
    tech_programmer: {
      category: 'Programmer Nightmare Bit',
      vibe: 'Late Night Coding Stand-up',
      headlines: [
        'Programmers are the only people who will spend 14 hours trying to automate a 2-second task, folks!',
      ],
      subJokes: [
        'I asked him, "Did you fix the bug?" He said, "No, but I made it look intentional."',
      ],
      observations: [
        'Crowd nodding in shared tech trauma.',
      ],
      memeTop: ['AUTOMATED THE PROCESS', 'IT TOOK 3 WEEKS'],
      memeBottom: ['TO SAVE 4 SECONDS A YEAR', 'AND BROKE THE DATABASE'],
      hashtags: ['#DevStandup', '#CoderJokes'],
    },
    gym_fail: {
      category: 'Gym Screaming Routine',
      vibe: 'Fitness Center Observational Bit',
      headlines: [
        'Anybody ever see a guy at the gym screaming so loud you think he\'s fighting a bear, and he\'s lifting a soup can?',
      ],
      subJokes: [
        'Give it up for the pre-workout powder, folks! Doing 90% of the emotional labor today!',
      ],
      observations: [
        'Gym bro applause: Loud and sweaty.',
      ],
      memeTop: ['HE ROARED LIKE A TIGER', 'AT PLANET FITNESS'],
      memeBottom: ['THE WEIGHT WAS A RUBBER DUCK', 'THEY HIT THE LUNK ALARM'],
      hashtags: ['#GymStandup', '#FitnessRoast'],
    },
    diy_fail: {
      category: 'Home Improvement Comedy',
      vibe: 'Handyman Disasters',
      headlines: [
        'Folks, there are two kinds of people: people who call a professional, and people who own an entire case of duct tape!',
      ],
      subJokes: [
        'He told his wife, "I\'ll fix that pipe on Saturday." He didn\'t say which year, folks!',
      ],
      observations: [
        'Handyman applause: Resigned chuckles.',
      ],
      memeTop: ['I CAN FIX IT MYSELF', 'SAVED $50 ON A PLUMBER'],
      memeBottom: ['JUST NEED 5 MORE ROLLS OF TAPE', 'HOUSE IS CURRENTLY A WATERPARK'],
      hashtags: ['#DIYStandup', '#HomeImprovement'],
    },
    car_vehicle: {
      category: 'Used Car Lot Routine',
      vibe: 'Automotive Stand-up',
      headlines: [
        'You ever drive a car where the check engine light is basically the only reliable light on the dashboard?',
      ],
      subJokes: [
        'My mechanic looked under the hood and said, "Sir, this car isn\'t running on gas; it\'s running on nostalgia."',
      ],
      observations: [
        'Crowd resonance: High.',
      ],
      memeTop: ['THE MECHANIC CALLED ME', 'SAID MY CAR HAS CHARACTER'],
      memeBottom: ['HE WAS CRYING', 'CHARACTER IS AN EXPENSIVE DISEASE'],
      hashtags: ['#CarStandup', '#AutoJokes'],
    },
    selfie_portrait: {
      category: 'Comedy Club Feature Set',
      vibe: 'Late Night Roast Bit',
      headlines: [
        'So I was looking at this photo, and folks, this is why aliens fly past Earth and lock their spaceship doors.',
        'You ever look at someone and immediately know they have a heated argument with an automated phone tree once a week?',
      ],
      subJokes: [
        'I showed this picture to my therapist and she raised her hourly rate on the spot.',
      ],
      observations: [
        'Crowd reaction: Nervous laughter turning into polite applause.',
      ],
      memeTop: ['SO I WALKED INTO THE CLUB', 'WHEN SOMEONE SHOWS ME THEIR NEW HEADSHOT'],
      memeBottom: ['AND SAW THIS EXACT SITUATION', 'AND I HAVE TO FIND SOMETHING NICE TO SAY'],
      hashtags: ['#StandupComedy', '#BaDumTss'],
    },
    cluttered_chaos: {
      category: 'Stand-up Room Rant',
      vibe: 'Observational Comedy',
      headlines: [
        'Anybody ever visit a room where the floor is basically a suggestion? We got one right here, folks!',
      ],
      subJokes: [
        'You don\'t clean a room like this with a vacuum; you clean this with a snowplow and an apology letter.',
      ],
      observations: [
        'Sitcom audience reaction: Audible gasps.',
      ],
      memeTop: ['MY ROOM IS NOT MESSY', 'I KNOW EXACTLY WHERE EVERYTHING IS'],
      memeBottom: ['IT JUST HAS CHARACTER', 'ITS IN THAT PILE OVER THERE SOMEWHERE'],
      hashtags: ['#StandupRoast', '#ObservationalComedy'],
    },
    food_chaos: {
      category: 'Restaurant Nightmare Routine',
      vibe: 'Kitchen Confessions',
      headlines: [
        'I ordered the special, and folks, the only thing special about it was the dental risk!',
      ],
      subJokes: [
        'The waiter came over and asked, "How is everything?" I said, "The napkin is holding up great!"',
      ],
      observations: [
        'Dental emergency probability: Elevated.',
      ],
      memeTop: ['THE CHEF CAME OUT TO ASK HOW IT WAS', 'ORDERED THE HOMESTYLE CHEF SPECIAL'],
      memeBottom: ['I ASKED IF HE HAD HEALTH INSURANCE', 'THE HOME HAS BEEN FORECLOSED'],
      hashtags: ['#FoodComedy', '#ChefJokes'],
    },
    dark_moody: {
      category: 'Night Owl Bit',
      vibe: 'Late Night Observations',
      headlines: [
        'You ever look at someone who only lives in dark rooms? They look like they\'re charging via USB cable!',
      ],
      subJokes: [
        'I said, "Turn on a lamp!" He said, "I don\'t want to alarm the vampires."',
      ],
      observations: [
        'Night owl factor: 100%.',
      ],
      memeTop: ['LIVING IN THE DARK', 'WHEN THE ELECTRIC BILL COMES'],
      memeBottom: ['LIKE A DISCOUNT NOCTURNAL CREATURE', 'I GUESS WE LIVE IN THE SHADOWS NOW'],
      hashtags: ['#NightOwlJokes', '#DarkHumor'],
    },
    scenic_nature: {
      category: 'Camping & Hiking Bit',
      vibe: 'City Person in the Woods',
      headlines: [
        'City people going into nature is my favorite comedy show. Two minutes in, they\'re negotiating with a beetle!',
      ],
      subJokes: [
        'You can tell this hiker isn\'t outdoorsy because they packed three portable phone chargers and zero water!',
      ],
      observations: [
        'Bug confrontation count: 12 screams recorded.',
      ],
      memeTop: ['GOING FOR A REFRESHING HIKE', 'NATURE IS SO PEACEFUL'],
      memeBottom: ['UNTIL A FLY TOUCHES MY SHOULDER', 'EXCEPT FOR THE BUGS, ROCKS, AND DIRT'],
      hashtags: ['#CityGuyInNature', '#HikingHumor'],
    },
  },
};

export function resolveTemplateKey(
  analysis: ImageAnalysis,
  categoryHint?: SubjectCategory,
  customHint?: string
): string {
  // If user or sample explicitly provided a category hint
  if (categoryHint && categoryHint !== 'auto' && categoryHint in TEMPLATES_BY_STYLE.roast) {
    return categoryHint;
  }

  // Check custom text keywords
  if (customHint) {
    const text = customHint.toLowerCase();
    if (text.includes('cat') || text.includes('kitten') || text.includes('kitty') || text.includes('meow')) return 'pet_cat';
    if (text.includes('dog') || text.includes('puppy') || text.includes('doggo') || text.includes('pup')) return 'pet_dog';
    if (text.includes('code') || text.includes('dev') || text.includes('program') || text.includes('bug') || text.includes('screen') || text.includes('error')) return 'tech_programmer';
    if (text.includes('gym') || text.includes('workout') || text.includes('lift') || text.includes('muscle') || text.includes('weight')) return 'gym_fail';
    if (text.includes('tape') || text.includes('diy') || text.includes('fix') || text.includes('repair') || text.includes('pipe') || text.includes('engineer')) return 'diy_fail';
    if (text.includes('car') || text.includes('auto') || text.includes('vehicle') || text.includes('truck') || text.includes('drive')) return 'car_vehicle';
    if (text.includes('food') || text.includes('cook') || text.includes('pizza') || text.includes('burnt') || text.includes('eat') || text.includes('kitchen')) return 'food_chaos';
    if (text.includes('mess') || text.includes('room') || text.includes('desk') || text.includes('clutter')) return 'cluttered_chaos';
  }

  // Visual Heuristic Fallback
  if (analysis.suggestedCategory && analysis.suggestedCategory in TEMPLATES_BY_STYLE.roast) {
    return analysis.suggestedCategory;
  }
  if (analysis.colorDominance === 'food_red') {
    return 'food_chaos';
  }
  if (analysis.complexity === 'cluttered') {
    return 'cluttered_chaos';
  }
  if (analysis.brightness === 'dark') {
    return 'dark_moody';
  }
  if (analysis.colorDominance === 'green_nature' && analysis.aspectRatio === 'landscape') {
    return 'scenic_nature';
  }
  return 'selfie_portrait';
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

export function generateBuiltinJoke(
  analysis: ImageAnalysis,
  style: HumorStyle,
  spiceLevel: number = 70,
  categoryHint?: SubjectCategory,
  customContext?: string
): JokeResult {
  const styleTemplates = TEMPLATES_BY_STYLE[style] || TEMPLATES_BY_STYLE.roast;
  const templateKey = resolveTemplateKey(analysis, categoryHint, customContext);
  const template = styleTemplates[templateKey] || styleTemplates.selfie_portrait;

  let headline = getRandomItem(template.headlines);
  if (customContext && customContext.trim().length > 3) {
    headline = `"${customContext.trim()}": ${headline}`;
  }

  const subJokes = getRandomSubset(template.subJokes, 3);
  const observations = getRandomSubset(template.observations, 3);
  const memeTop = getRandomItem(template.memeTop);
  const memeBottom = getRandomItem(template.memeBottom);

  const computedRoast = Math.min(
    99,
    Math.max(25, Math.round(spiceLevel * 0.7 + (analysis.complexity === 'cluttered' ? 15 : 5) + Math.random() * 15))
  );

  return {
    headline,
    subJokes,
    observations,
    memeTop,
    memeBottom,
    roastMeter: computedRoast,
    vibeTag: template.vibe,
    categoryDetected: template.category,
    suggestedHashtags: template.hashtags,
    source: 'builtin',
  };
}
