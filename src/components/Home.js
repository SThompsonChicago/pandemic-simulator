import { useReducer, useEffect, useRef } from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
import Header from './Header';
import Footer from './Footer';

const math = require('mathjs');

let count = 0;

const styles = {
  hov: {
    cursor: 'pointer',
  },
  right: {
    float: "right",
  },
  space: {
    margin:"5px",
  },
}

// Number of rows in the grid
const n = 20;

// Number of nodes in the transportation network
const N = n * n;

// Superdiffusion parameter
const mu = 0.6;

// Step size for ODE solver
const h = 0.01;

// The "diffusion" coefficient
const D = 0.005;

// Number of time intervals
const periods = 4;

let a = math.zeros(N, N);
let m = math.zeros(N, N);
let aDiffusion = math.zeros(N, N);
let mDiffusion = math.zeros(N, N);

// let c = new Array(n);
// for (let i = 0; i < n; i++){
//     c[i] = new Array(n).fill(0);
// }


// for (let i = 0; i < n; i++) {
//   for (let j = 0; j < n; j++) {
//     c[i][j] = (j !== 0 && j !== n - 1) * 0.3 * Math.random() + (0.5 + 0.5 * Math.random()) * (j === 0 || j === n - 1);
//     let rando = Math.random();
//     let rando2 = Math.random();
//     if(rando > 0.45 && rando2 > 0.45)
//     c[i][j] = 0.4 * (rando + rando2);
//   }
// }



let c = [[0.5755951483871738, 0.049671816036299, 0.13992873258806304, 0.08764762633505141, 0.5814739892431717, 0.1780979952155575, 0.29058792293984753, 0.5653063958923548, 0.2996236182681453, 0.025299908300829222, 0.2966463154175256, 0.2812246362642324, 0.08863444873703631, 0.3945360346138399, 0.14711649999329732, 0.12966644124191348, 0.231638995073393, 0.16832621579711932, 0.5414569718132451, 0.9444525515132772],
[0.6930511302809681, 0.7028044999703095, 0.4066808150821862, 0.1876285084379122, 0.06753383635939111, 0.19619869974545773, 0.2763495452685704, 0.28736991416916985, 0.6744472911226111, 0.1326435412845072, 0.01614603183941543, 0.22317963184492243, 0.1256750823577049, 0.6409222788445349, 0.5334025995115509, 0.5465484082659168, 0.11480685130681309, 0.49171040211784167, 0.09080763405974754, 0.6353578089211926],
[0.9173551880697326, 0.23356714684797247, 0.6419158869516552, 0.04386833111465405, 0.5447727193371974, 0.11151267406814515, 0.038581294756218985, 0.2676215555011712, 0.03206691268710753, 0.08159593218397172, 0.12504657869015098, 0.043088003733687395, 0.22013635813932456, 0.12809043998761308, 0.4685461890177982, 0.23434489054890906, 0.6605092355364194, 0.2605306362095185, 0.07712472468929743, 0.9329009845156788],
[0.6447318252370816, 0.004988395871593476, 0.5755880814030823, 0.10533458809527482, 0.043017552800399025, 0.2865950396564422, 0.5325560360556619, 0.25910695081663143, 0.18172849935201948, 0.1810800783811089, 0.0622914690493783, 0.24968967209867357, 0.2164169178357556, 0.12328698660049342, 0.261655793233325, 0.5579796946182699, 0.007169987956742885, 0.5211109567960345, 0.4111123074040716, 0.7881703038359599],
[0.5007562747182794, 0.18099049830813022, 0.22025714434353721, 0.15075409610533982, 0.10232944669576269, 0.1946508143741154, 0.1980280427473419, 0.5085418472977395, 0.27348528557866963, 0.02009366433405324, 0.09780334630718869, 0.19040473558644172, 0.1388961818567614, 0.0325572971870056, 0.18572964535566042, 0.14244863223372073, 0.5552356462525725, 0.6613947066664703, 0.24581657301820042, 0.8260297486363142],
[0.7785791061945708, 0.0924234884925728, 0.07521226368936147, 0.17112055798805684, 0.14534418500738103, 0.0787965797660513, 0.08530392024757709, 0.44528905678471137, 0.5626496385877773, 0.05375313080395876, 0.2191037014009253, 0.004768020480657297, 0.11994733808917035, 0.12007882546560075, 0.6804611257234937, 0.5852834455112874, 0.5083510600497632, 0.6895728690780135, 0.29882046657177636, 0.5112170069259548],
[0.5669431609424768, 0.24334744884105886, 0.08836823086987533, 0.029602898272326605, 0.6278653714773683, 0.21866511785866435, 0.0674646667300648, 0.14414620417529003, 0.03542367381983218, 0.5386046821725919, 0.09520419866594505, 0.6050617776873076, 0.02762118764305728, 0.005093327038947514, 0.5830594576072878, 0.24324527183856925, 0.1731148184922501, 0.6442118177161569, 0.2213181362350142, 0.5980477383668551],
[0.7940522970599749, 0.11906414211600026, 0.24007465054367175, 0.12835544012984512, 0.36989677675421045, 0.4192110580182411, 0.11538164157465569, 0.46490520045015415, 0.47843838449180015, 0.5650313569971817, 0.2748743717885252, 0.01676938928516698, 0.07149253468314895, 0.4341114849989647, 0.10124240216150661, 0.2844782052815473, 0.5909757205618791, 0.19213234572146556, 0.5960198743223569, 0.5249377896988779],
[0.5243208906936513, 0.6018483000365772, 0.6973940276327423, 0.5596411883386021, 0.09792020508142814, 0.2293538710010975, 0.07251871194571464, 0.023051520959537972, 0.2608891225761886, 0.23587108126779902, 0.029326584029346292, 0.7628229980319039, 0.06140410209622253, 0.14574206750894558, 0.6389039941857124, 0.6854741627078491, 0.07335437756018819, 0.2306505167497198, 0.013857361041192196, 0.5176922106302477],
[0.9899701794755245, 0.004361913053200972, 0.6518619722738116, 0.6906705952118504, 0.4210036283939628, 0.02007472573357414, 0.12360416417460118, 0.023035375998951002, 0.01433260751260046, 0.4848815629024874, 0.18996057505728325, 0.6470257903798543, 0.20466215730599027, 0.5615068479456514, 0.23463568621775438, 0.15853396295340283, 0.7065268017782175, 0.12740397478112012, 0.08252148627416844, 0.6798597013097699],
[0.5517039879941629, 0.44179839603324433, 0.2933509445877195, 0.6042684194781147, 0.2028760615239121, 0.09109990864859838, 0.168204450566013, 0.29625944775565727, 0.022698312567321376, 0.2913039793008594, 0.05687408383188072, 0.019004318257542584, 0.053622137866919585, 0.6046514915125925, 0.03693521360217351, 0.6823407162868894, 0.2491801343938278, 0.21134974151777622, 0.6837123249583095, 0.7334252138775021],
[0.5078005511180844, 0.16082036874785285, 0.0765058501565299, 0.46543114061750857, 0.03489282467851684, 0.5198716029163198, 0.17276184063278288, 0.27950145775999374, 0.10880237574205949, 0.2151996827685439, 0.20395057434927413, 0.0845290484631056, 0.02731082076975102, 0.44455445286237005, 0.1279727140411491, 0.07550714937283202, 0.6659348975957182, 0.18330125514982867, 0.1739894343355345, 0.9922695341521824],
[0.5555708062118061, 0.08406486278155283, 0.0121130715242198, 0.5934009680530805, 0.03000066467748681, 0.0486618271964897, 0.05146464486839617, 0.0905209351152387, 0.5575230849880197, 0.04773007736694752, 0.23774294441595079, 0.18649441563984906, 0.232530730849754, 0.006297539709403921, 0.2815771692309447, 0.29008949127038297, 0.004372703108489228, 0.11193789176784594, 0.26398338538111427, 0.5404946825128695],
[0.8791811913853954, 0.5485160534623995, 0.2539931958885614, 0.2893846717616578, 0.053015818612795605, 0.048793029338665604, 0.0836362396723105, 0.16341075428108578, 0.052552473808185, 0.49652901742610234, 0.07597215792794405, 0.5130065974032995, 0.20234609561590852, 0.15850923235676115, 0.24733626717306145, 0.011762868995449649, 0.22182048479743136, 0.06527000193264944, 0.1555193949905536, 0.6544604203502459],
[0.5503703078745574, 0.2839389925504668, 0.0786956415365412, 0.18316942110082116, 0.0779283787297201, 0.10617953860454606, 0.16862435432743864, 0.16082479029893593, 0.19022592711492117, 0.21874871412018126, 0.4483399462925812, 0.2515868087650597, 0.6262247635151705, 0.26317854723726836, 0.046899094885024195, 0.11781133720637771, 0.18926449667837966, 0.08804445904854703, 0.5355716990913221, 0.7396641358428181],
[0.7686658074994364, 0.027000625877078122, 0.1101214510817235, 0.09688838683287657, 0.01176108920391432, 0.1255916685678358, 0.0896695258833243, 0.11996092753470042, 0.5634750834716747, 0.14140735105032168, 0.0794400431202364, 0.008995010483524423, 0.09568588859576112, 0.020662577818601233, 0.12208872898220285, 0.13604427033483454, 0.41167140594015267, 0.2090143298971172, 0.19639853053867465, 0.9414559476086743],
[0.5300207410242516, 0.6294428971786318, 0.05372108450406676, 0.2398694419752953, 0.030253179972733135, 0.22823460157396536, 0.018988157940850958, 0.16508411117000044, 0.20462563851835294, 0.018056584596161062, 0.5341264305124264, 0.012213945537277615, 0.734494872869723, 0.2582135788676226, 0.05391670682051901, 0.09997757572153607, 0.2291185550328448, 0.6431932109682057, 0.19974548892996238, 0.8459973583467509],
[0.8031069362846639, 0.04967015357197633, 0.047793272350209935, 0.19787268691533313, 0.21664430889874545, 0.6093977773902889, 0.19627278631492187, 0.023289717030675925, 0.11477865079956184, 0.5145924988939794, 0.005646131085372774, 0.05234256016095233, 0.09818672122765681, 0.49920942120135914, 0.48473335349068813, 0.37889154446672874, 0.48341214756770595, 0.5490905988187104, 0.23885212828255287, 0.7756770008587125],
[0.8489873080326793, 0.189796593920934, 0.03268685364241173, 0.06535372126777805, 0.2987225928652199, 0.0965633617148609, 0.2509607227719607, 0.02863576624106927, 0.0034511689768313533, 0.5241424381082819, 0.42174519054634696, 0.1298906764291743, 0.0373411959008535, 0.05528399249876657, 0.22800801118139238, 0.6967350781546318, 0.1957866879758246, 0.668062122798861, 0.2803166176284209, 0.6999502124926856],
[0.7482569947741431, 0.2529971769886013, 0.6977383102630518, 0.066877843087, 0.2390909424802069, 0.29519097947553874, 0.09364111713125345, 0.027786537315214965, 0.23931673173604906, 0.051073927684144094, 0.17440332676586248, 0.2652028115730563, 0.2774735584392421, 0.11914520636338974, 0.036409115397076676, 0.12757036496649277, 0.10073080788660305, 0.10592639975611663, 0.4380443948800962, 0.7881570920854284]];

let demo = [
  [
      0.19969866766868052,
      0.03184061516025755,
      0.12373254897214332,
      0.11044363280862188,
      0.4826891767369824,
      0.20135308023595036,
      0.22632667409735968,
      0.27188749490277014,
      0.11479859290557483,
      0.0072795463087311245,
      0.05628790223658341,
      0.039077400084256406,
      0.009408259616689783,
      0.031215146680269604,
      0.009288268078357113,
      0.00652887931660035,
      0.009410209899684257,
      0.005637482893021918,
      0.014952518870290024,
      0.02184848070055141
  ],
  [
      0.28615161373743464,
      0.41307111912541666,
      0.4318746033674534,
      0.39223180266638336,
      0.23834417855200682,
      0.40313686941689214,
      0.3414407062832762,
      0.22383521507592705,
      0.2796742972339297,
      0.04513621292722146,
      0.0037656088928281796,
      0.03496581826083374,
      0.014535735509838358,
      0.05330843807609395,
      0.0348510744821386,
      0.028329195536388692,
      0.004892289613438985,
      0.01690298259102108,
      0.0026223665192867977,
      0.015215615430592152
  ],
  [
      0.3941579142645243,
      0.24760643294555004,
      0.6771026333827932,
      0.32965576055392365,
      0.8970715376682669,
      0.5518562986101312,
      0.11767655610386245,
      0.2738855380921986,
      0.022281492020127344,
      0.03234896632388433,
      0.03137436608483076,
      0.00748476158786484,
      0.026666352162861427,
      0.011646519140916108,
      0.03185841190509541,
      0.012723044764925537,
      0.02822295828456939,
      0.009236248796935905,
      0.0022722124446158012,
      0.022565084349707873
  ],
  [
      0.33082622688109026,
      0.007997018698804466,
      0.7115679311325561,
      0.7269810981929941,
      0.9412535298839275,
      0.8548924814826039,
      0.6978927262777688,
      0.29537381046552696,
      0.12269425256675824,
      0.07243301630027721,
      0.016436527388622876,
      0.04293871408416022,
      0.026759032264339056,
      0.01139560953863147,
      0.018260879561224783,
      0.030074718568370018,
      0.0003177963981390128,
      0.01843223930989258,
      0.01207927832491952,
      0.01924928578514448
  ],
  [
      0.26215479886951665,
      0.20299346631263088,
      0.42968785842279855,
      0.6204797494935557,
      0.7224787948495549,
      0.6748312110838466,
      0.404398098452793,
      0.41608570920069915,
      0.1628807893695697,
      0.008166322255531589,
      0.024687805699110554,
      0.032256986916012725,
      0.016999862254954267,
      0.0029859122189006336,
      0.012862645828212442,
      0.0077641597083987655,
      0.023807584645766048,
      0.02311797342914134,
      0.007213860429014915,
      0.02004618389049881
  ],
  [
      0.30885006214835514,
      0.08460758535453723,
      0.12376100460893644,
      0.36987720062986246,
      0.39868696211011184,
      0.2135034656313842,
      0.13804457729863556,
      0.3082372804963114,
      0.2446033465647718,
      0.018747205735441134,
      0.04876221835747813,
      0.0007731626292126654,
      0.013885890986801774,
      0.010425919786390814,
      0.04394028749808775,
      0.030237974600183015,
      0.021291306559372277,
      0.023557116104988052,
      0.0085912680061118,
      0.012292617507349474
  ],
  [
      0.19619777870671948,
      0.13764514434259323,
      0.08117143975340502,
      0.03993324289439289,
      0.49926179407308924,
      0.23484647486340507,
      0.06327605377809173,
      0.086576177536666,
      0.014996521418360555,
      0.13461788153849757,
      0.018758400150134504,
      0.0803957743136614,
      0.002950615519812089,
      0.00041474954889249787,
      0.035751379548004836,
      0.01217011033565757,
      0.007045194681777821,
      0.021256413666778055,
      0.0061761153820523865,
      0.0139586320012175
  ],
  [
      0.1989189783502593,
      0.048539108573083106,
      0.12064587798173472,
      0.08308484008716109,
      0.22083970708088585,
      0.228921703565595,
      0.062078765845927225,
      0.16647997322372882,
      0.12994445373868274,
      0.11357704015290779,
      0.04378916018837675,
      0.0020844142340178846,
      0.0067503919403351905,
      0.031117801182603756,
      0.0059043601279581675,
      0.013273844709639474,
      0.022362016153454692,
      0.006123504913178346,
      0.01576552171272541,
      0.011817966255395586
  ],
  [
      0.10637397802571179,
      0.14796737094148874,
      0.19790797399694166,
      0.1856292728366818,
      0.04036705423744885,
      0.08579298831639778,
      0.025087360272070574,
      0.006611556334285909,
      0.05581783669259412,
      0.03969108639534401,
      0.003949745125824363,
      0.07431891494251569,
      0.005060750472957235,
      0.009516994891338282,
      0.03290694652595253,
      0.029013484308346167,
      0.002638416918917107,
      0.006906557351105883,
      0.00035257877172296893,
      0.011113157886203037
  ],
  [
      0.14181991811885183,
      0.0008756487405065839,
      0.13250858332120422,
      0.15163301196908185,
      0.10139158912778905,
      0.005165878972471463,
      0.02807600021469521,
      0.0045976889335886395,
      0.002377308067139448,
      0.06155429301769904,
      0.020299788198517667,
      0.053883398542518314,
      0.014367729750804753,
      0.03156818464032141,
      0.011088885565520944,
      0.0062459635054834435,
      0.022937465436538032,
      0.0035634241494272587,
      0.001966695924122891,
      0.01376047201033635
  ],
  [
      0.06454199680633842,
      0.060097876911970396,
      0.04559031545702202,
      0.09589872038472892,
      0.035218752171022605,
      0.01568732934982681,
      0.026555938038820337,
      0.04099335935034529,
      0.002816586968032153,
      0.029754565722951203,
      0.004978307056167199,
      0.001388140098851959,
      0.0032466067400155085,
      0.029724717840927364,
      0.001565300413323522,
      0.023821589919039075,
      0.007506498669070934,
      0.005444336377437346,
      0.014984980896802965,
      0.013938628164394356
  ],
  [
      0.046212494160967864,
      0.016975911675013163,
      0.008929522401598467,
      0.05491920002657917,
      0.004419965519460921,
      0.060862867034080434,
      0.01989526333791564,
      0.02907254165418528,
      0.010234765571314319,
      0.017510491416226175,
      0.014312942808925824,
      0.005108347180533559,
      0.0014086191722422526,
      0.01917437334711614,
      0.004773556732091029,
      0.002413683440812429,
      0.018009205332863855,
      0.004337373568195099,
      0.003571018117167486,
      0.01753188380813936
  ],
  [
      0.039593079756245535,
      0.006819789089363594,
      0.0010652516113555577,
      0.051937999614374245,
      0.0028037839620628684,
      0.0044694131312639955,
      0.0045074836002820876,
      0.00733539807758841,
      0.03965967246958956,
      0.0031397223405100335,
      0.01361372367311389,
      0.009351578649321084,
      0.010115124759456402,
      0.0002396764425273314,
      0.00919677199538201,
      0.008227352654875142,
      0.00010871070689689915,
      0.0024205626993344847,
      0.004982507967306786,
      0.008941197496013709
  ],
  [
      0.04919544118797679,
      0.03377086856684159,
      0.016916057459686367,
      0.019971880654844554,
      0.0037643264448009844,
      0.0034194327948985424,
      0.005627763322622374,
      0.010295923834311174,
      0.0030766562956029255,
      0.0257765502519567,
      0.0036141138792211017,
      0.021296757203310424,
      0.0075223643705978295,
      0.005197128134939574,
      0.007112987601996896,
      0.0002991470401412865,
      0.004936289178402971,
      0.0012841655140674226,
      0.002697772483179096,
      0.009996301428943167
  ],
  [
      0.02543423380128548,
      0.014200394576354983,
      0.004182161632842965,
      0.009987212919410127,
      0.004316602246806329,
      0.005807363535918063,
      0.008907084049926767,
      0.008078541333332159,
      0.008916111622505475,
      0.00944151554357471,
      0.017468865152479602,
      0.008919124899191349,
      0.01967819066320056,
      0.0074707563825109876,
      0.0011916331477068657,
      0.0026551561045402407,
      0.0037863430605932563,
      0.0015699853700691748,
      0.008449607299402973,
      0.010411173143639842
  ],
  [
      0.02891699951927258,
      0.0011060848912467182,
      0.004694285209908736,
      0.004242890911445906,
      0.0005214730168046019,
      0.0054899598212803085,
      0.0038237114126419888,
      0.004893274743716797,
      0.021336096640031096,
      0.005071125365463316,
      0.0026310806915252243,
      0.0002727713499432294,
      0.002626356279720669,
      0.0005132451761066154,
      0.0027225645458282396,
      0.0027241607409832815,
      0.0073640540397459636,
      0.003369522333508831,
      0.002845656866965433,
      0.012167663849355147
  ],
  [
      0.016716749824575286,
      0.020772149226803413,
      0.0018747669946530656,
      0.008504950608684732,
      0.0010884630262787914,
      0.008090319710676558,
      0.0006631067982836201,
      0.005530989191214906,
      0.006516758703808868,
      0.0005435409590337756,
      0.014760176348350208,
      0.0003161026591498457,
      0.017142310669265855,
      0.0055640633880018305,
      0.0010607166940163643,
      0.0017821461112300441,
      0.0036915894695418784,
      0.009330761012852438,
      0.0026408954221938314,
      0.010064144254575837
  ],
  [
      0.021121942615405342,
      0.0013916879159835587,
      0.0013824611625937223,
      0.005810871932176831,
      0.00639792034013125,
      0.017680160792497516,
      0.0056513513904081,
      0.0006528399129349756,
      0.003072292960747317,
      0.012918555622696575,
      0.00013486026728501134,
      0.0011634171952175198,
      0.002019087487443948,
      0.009383361956421565,
      0.008364140194166376,
      0.005993216697675688,
      0.006976543747041644,
      0.007228454344190283,
      0.0028787534086502525,
      0.008480695130070694
  ],
  [
      0.018950397792908507,
      0.004462550796898241,
      0.0007930694248951359,
      0.0016125646280650615,
      0.007372156872814016,
      0.002381874301362552,
      0.0060619739448908565,
      0.0006760244628744803,
      0.0000784466716042964,
      0.011239115347823039,
      0.008573608206496204,
      0.0024936142330240145,
      0.0006701263953917572,
      0.0009211465295598561,
      0.0035037990094595015,
      0.009810007067796502,
      0.002554312147777821,
      0.007961595619329796,
      0.0030796040009409033,
      0.007028862467362456
  ],
  [
      0.014350716671436647,
      0.005062719457119119,
      0.014176648946279909,
      0.0013971963104294012,
      0.005003765944468256,
      0.006139353504259756,
      0.0019264170395388665,
      0.0005582514989304798,
      0.004629366397418714,
      0.0009510328144486183,
      0.003082877661705214,
      0.004422838616883887,
      0.0043475869646252266,
      0.0017500248458216477,
      0.0004986700206376978,
      0.0016206005228948798,
      0.0011853191981582288,
      0.001152095283694462,
      0.004383439237821012,
      0.007259048958994891
  ]
];

let totalPop = 0;

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    totalPop += c[i][j];
  }
}

let initial = new Array(n);
for (let i = 0; i < n; i++){
    initial[i] = new Array(N).fill(0);
}

let cur = new Array(n);
for (let i = 0; i < n; i++){
    cur[i] = new Array(n).fill(0);
}

initial[3][4] = 1;

// Create an N x periods matrix to hold solution to ODE system
let u = math.zeros(N, periods);

// Population distribution
//const c = math.matrix([[300, 50, 50, 400], [300, 10, 10, 200], [50, 10, 10, 400], [100, 10, 50, 50]]);
//let c = math.ones(n, n);

// c.subset(math.index(0,0), 0.1);
// c.subset(math.index(n - 1,0), 0.1);
// c.subset(math.index(0, n - 1), 0.1);

// for (let i = 0; i < n; i++) {
//   for (let j = 0; j < n; j++) {
//     let val = Math.random();
//     c.subset(math.index(i,j), val);
    
//   }
// }




const xLabels = new Array(n).fill(0).map((_, i) => `${i+1}`);
const yLabels = new Array(n).fill(0).map((_, i) => `${i+1}`).reverse();

const data = new Array(yLabels.length)
  .fill(0)
  .map(() =>
    new Array(xLabels.length)
      .fill(0)
  );

const initialState = {
  isRunning: false,
  infections: demo,
  time: 56,
  periods: 0,
  population: c,
  message: 'Current state (click the "Run" button above to start the simulation)',
  percentSick: 100*c[0][0]/totalPop,
  alpha: 7,
  beta: 0.4,
  nonlocal: true,
  mil: 250
}

export default function Home() {


  const [state, dispatch] = useReducer(reducer, initialState);
  const idRef = useRef(0);


  const infectionDist = (_x, _y) => {
    return state.infections[_x][_y];
  } 

  const populationDist = (_x, _y) => {
    return state.nonlocal * state.population[_x][_y] + (!state.nonlocal) * 0.2;
  }

  const showPercent = () => state.percentSick;

  const runner = () => state.time;

  useEffect(() => {
    if (!state.isRunning) {
      return;
    } else if (state.nonlocal){
      idRef.current = setInterval(() => dispatch({ type: "iterate" }), state.mil);
      return () => {
        clearInterval(idRef.current);
        idRef.current = 0;
      };
    } else {
      idRef.current = setInterval(() => dispatch({ type: "iteratediffusion" }), state.mil);
      return () => {
        clearInterval(idRef.current);
        idRef.current = 0;
      };
    }
  }, [state.isRunning]);



  return (
    <div className="notification is-black">
      <Header />
      <header className="navbar" style={styles.right}>

<a className="button is-black"
  style={styles.space}
  onClick={() => dispatch({ type: "run" })}
    >
      <span>Run</span>
    </a>
    <a className="button is-black"
    style={styles.space}
    onClick={() => dispatch({ type: "stop" })}
    >
      <span>Stop</span>
    </a>
    <a className="button is-black"
    style={styles.space}
    onClick={() => dispatch({ type: "reset" })}
    >
      <span>Reset</span>
    </a>

</header>
      <div className='box'>
        <p className="title is-4 is-hidden-mobile">
                            What is this?
                        </p>
                        <p>
                            This web application uses a modern epidemiological model to help the user visualize the way contagious diseases spread. See below for more information about the model and options for changing different inputs. The "Infection Distribution" chart shows the percentage of people in each location who are sick—the redder the square, the higher the percentage of people who are infected—and updates in real time as the app calculates the solution to the model. Click the "Run" button to start the simulation. 
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-6-mobile">
                            {state.message}
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6 is-size-6-mobile">
                          Number of days after initial outbreak: {state.time}
                        </p>
                        <div className="columns">
        <div className="column">
                        
                   <div className="box">   
                   <p className="title is-6 has-text-centered is-size-6-mobile">
                     Infection Distribution
                  </p>

            
      <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        squares
        // Reder cell with tooltip
        cellRender={(x, y, value) => (
          <div title={`Pos(${x}, ${y}) = ${value}`}></div>
        )}
        xLabelsStyle={() => ({
          fontSize: ".65rem",
          textTransform: "uppercase",
          color: "#777"
        })}
        yLabelsStyle={() => ({
          fontSize: ".65rem",
          textTransform: "uppercase",
          color: "#777"
        })}
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(${infectionDist(_x, _y)*255 }, 0, ${(1 - infectionDist(_x, _y))*255})`
        })}
        cellHeight="1rem"
        xLabelsPos="bottom"
        onClick={(x, y) => null}
        // yLabelsPos="right"
        // square
      />



<p className="subtitle is-6 has-text-centered is-size-6-mobile">
                     Red = 100% infection rate, Blue = 0% infection rate
                  </p>
            </div>  
            
          </div>

        <div className="column">
        
            
                        
                   <div className="box">   
                   <p className="title is-6 has-text-centered is-size-6-mobile">
                     Population Distribution
                  </p>
    
            <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        // Reder cell with tooltip
        cellRender={(x, y, value) => (
          <div title={`Pos(${x}, ${y}) = ${value}`}></div>
        )}
        xLabelsStyle={() => ({
          fontSize: ".65rem",
          textTransform: "uppercase",
          color: "#777"
        })}
        yLabelsStyle={() => ({
          fontSize: ".65rem",
          textTransform: "uppercase",
          color: "#777"
        })}
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(${(1 - populationDist(_x, _y))*255 }, ${(1 - populationDist(_x, _y))*255}, ${(1 - populationDist(_x, _y))*255 })`
        })}
        cellHeight="1rem"
        xLabelsPos="bottom"
        onClick={(x, y) => null}
        // yLabelsPos="right"
        // square
      />

<p className="subtitle is-6 has-text-centered is-size-6-mobile">
                     Light = low population density, Dark = high population density
                  </p>
      </div>
      
      </div>
      </div>
      <p className="title is-4 is-size-6-mobile">
                            Effective transmission rate
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6 is-size-6-mobile">
                          Current value: {state.alpha.toFixed(1)} 
                          <br>
                            </br>
                        
                          
                          <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "increase" })}
    >
      <span>+</span>
    </a>
    <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "decrease" })}
    >
      <span>-</span>
    </a>
                        </p>
                        <p>
                          The effective transmission rate measures how many people a typical infected person will infect in a given period of time. The value of this parameter will vary with the type of disease, but it can also be changed by human decisions. For example, if people stay home when they get sick, then this may decrease the effective transmission rate. The buttons above can be used to change the transmission rate in this model. 
                          <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-6-mobile">
                            Recovery rate
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="subtitle is-6 is-size-6-mobile">
                          Current value: {state.beta.toFixed(1)} 
                          <br>
                            </br>
                        
                          
                          <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "increasebeta" })}
    >
      <span>+</span>
    </a>
    <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "decreasebeta" })}
    >
      <span>-</span>
    </a>
                        </p>
                        <p>
                          The recovery rate measures how quickly people recuperate from the disease. The recovery rate might increase if, for example, people get access to better medical care. Click the buttons above to increase or decrease the recovery rate for this model. 
                          <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-6-mobile">
                            Basic reproduction number
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="subtitle is-6 is-size-6-mobile">
                          Current value: {state.alpha / state.beta} 
                          <br>
                            </br>
                        </p>
                        <p>
                          The basic reproduction number, also sometimes referred to as R<sub>0</sub>, is the ratio of the effective transmission rate to the recovery rate. You can verify by experimenting with the other parameter values that the disease will die out if the basic reproduction number is less than one. For example, click "Reset", set the parameters at their default values (so the effective transmission number is 7 and the recovery rate is 0.4), click "Run", and let the simulation go for 50 or so "days". Then click "Stop", and lower the effective transmission rate to 0.3 while keeping the recovery rate at 0.4. Then click "Run" to continue the simulation with the new parameter values. You will see that the epidemic gradually disappears.
                          <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-6-mobile">
                            Population distribution function
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6 is-size-6-mobile">
                        
                          
                          <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "randompopulation" })}
    >
      <span>Random</span>
    </a>
    <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "restorepopulation" })}
    >
      <span>Default</span>
    </a>
                        </p>
                        <p>
                          In this model, people tend to travel to densely population areas like cities more frequently than they travel elsewhere. As a result, the population distribution function affects the way the disease spreads; high-population areas are often hit by the epidemic relatively quickly, even if they are far away from the initial outbreak. The default population distribution can be thought of as a highly schematized description of the US, with more densely populated areas on the east and west coasts. Click the buttons above to randomly generate a new population distribution or restore the default distribution. 
                          <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-6-mobile">
                            Outbreak location
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6 is-size-6-mobile">
                        
                          
                          <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "randomoutbreak" })}
    >
      <span>Random</span>
    </a>
    <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "restoreoutbreak" })}
    >
      <span>Default</span>
    </a>
                        </p>
                        <p>
                          The outbreak location gives the initial state of the model. Click the buttons above to reset the simulation with a random outbreak location or restore the default outbreak location, and then click the "Run" button at the top of the page to see the updated infection dynamics. 
                          <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-6-mobile">
                            Mobility type
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6 is-size-6-mobile">
                        <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "rundiffusion" })}
    >
      <span>Classical</span>
    </a>                     
                        <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "nonlocal" })}
    >
      <span>Nonlocal</span>
    </a>
                        </p>
                        <p>
                          This model is based on the idea that people sometimes take long-distance trips. This gives rise to "nonlocal" interactions which can spread diseases in complex ways. However, many classical epidemiological models only consider "local" interactions, and ignore spatial heterogeneities (like variations in population density). So this application also has a classical mode, in which people in the model only move by means of short trips, and the population distribution is uniform across the space. Click the "Classical" button above to switch to classical mode, and click the "Nonlocal" button to switch back to the default mode. 
                          <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
      <p className="title is-4 is-size-6-mobile">
                            More about this model
                        </p>
                        <p>
                
                        </p>
                        <p>
                            How does a disease like COVID-19 spread? To answer this question, we need to understand how people move from place to place. This web application demonstrates what some recent research can tell us about this. 
                            <br>
                            </br>
                            <br>
                            </br>
                            In the past, mathematical epidemiologists tried to understand human mobility by using the diffusion model from physics, which describes a person or object moving around by means of small, independent, random steps (as in the classical mode discussed above). However, it has been known for a long time that the diffusion model does not give a realistic way to describe the spread of all epidemics, because the way people move is more complicated. 
                            <br>
                            </br>
                            <br>
                            </br>
                            To develop a better model of human mobility patterns, Dirk Brockmann (then at Northwestern University) and colleagues <a href="http://rocs.northwestern.edu/research/wgstory.html">analyzed data from a variety of sources</a>. The nonlocal mode of this web application is based on <a href="https://ul.qucosa.de/api/qucosa%3A13918/attachment/ATT-0/">one of the simpler mathematical models they created</a> to capture the relationships they uncovered in the data. The model incorporates the idea that human mobility includes both short trips (i.e., a mile or less) along with occasional long-distance travel (such as airline flights). It also assumes that locations with higher population density tend to be visited more often than low-population areas. Brockmann's analysis of different data sources allowed him to quantify these ideas precisely. This model has <a href="https://www.aimsciences.org/article/doi/10.3934/eect.2013.2.173">has some interesting mathematical properties</a>, and <a href="https://rocs.hu-berlin.de">more sophisticated models</a> have been created as well. 
                            <br>
                            </br>
                            <br>
                            </br>
                            An important consequence of the model is that diseases tend to spread to high-population areas more quickly than low-population areas. This app offers a simple way to visualize this process. The user can also see how the results change when the effective transmission rate and recovery rate are altered (if the former becomes smaller than the latter, the disease will die out and the epidemic will be stopped!). Although the model presented here is relatively simplified, it illustrates the logic behind more sophisticated epidemiological models used by scientists today. One can hope that as these models grow more realistic, they will help to control the spread of future disease outbreaks by offering precise forecasts that can guide policy. 
                            <br>
                            </br>
                            <br>
                            </br>
                            {/* This model admittedly gives a <i>highly</i> schematized representation of how a pandemic would spread across the surface of the earth. But a truly realistic model would require a supercomputer to solve, as well as significant time spent on data gathering and programming. Nonetheless, this app helps illustrate the logic behind more sophisticated models, by providing a simple visual representation of spatial infection dynamics. 
                            <br>
                            </br>
                            <br>
                            </br> */}
                        </p>

                        <p className="title is-4 is-size-6-mobile">
                            How this web application was created
                        </p>
                        <p>

                        </p>
                        <p>
                            This is a single-page application created with ReactJS. I made the grids with react-heatmap-grid, and used mathJS to write the equation solver, which applies Euler's method to a system of 400 nonlinear differential equations. The app also uses React hooks to update the page in real time while the equations are being solved. 
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-6-mobile">
                            Further reading
                        </p>
                        <p>
                        Brockmann, D., David, V., and Gallardo, A. M. 2009. "Human mobility and spatial disease dynamics." <i>Reviews of nonlinear dynamics and complexity</i> 2: 1-24. <a href="https://ul.qucosa.de/api/qucosa%3A13918/attachment/ATT-0/">Link</a>.
                        <br>
                            </br>   
                            <br>
                            </br>                       
                        </p>
                        <p>
                          
                        <p>
Thompson, S. and Seidman, T. I. 2013. “Approximation of a Semigroup Model of Anomalous Diffusion in a Bounded Set.” <i>Evolution Equations and Control Theory</i> 2: 173-192. <a href="https://www.aimsciences.org/article/doi/10.3934/eect.2013.2.173">Link</a>.
<br>
                            </br>
                            <br>
                            </br>
</p>
<p>
Marshall, J. M., et al. 2018. "Mathematical models of human mobility of relevance to malaria transmission in Africa." <i>Scientific reports</i> 8: 1-12. <a href="https://www.nature.com/articles/s41598-018-26023-1">Link</a>.
  </p>

                        </p>
                        
          </div>
          <Footer />
          </div>
  );
}

// Define a one-to-one correspondence between an index k and nodes [i, j] in the network
function fun(k) {
  let i = k % n;
  let j = (k - i)/n;

  return [i,j];
}

// Inverse of one-to-one correspondence defined above
function funInverse(i, j) {
  return i + j * n;
}

// Calculate distance between nodes with indices k and l
function dist(k, l) {
  let node1 = fun(k);
  let node2 = fun(l);
  return math.distance([node1[0], node1[1]], [node2[0], node2[1]]);
}

// Create matrix describing rates at which people move between nodes
function createMatrix() {
  for (let i = 0;  i < N; i++) {
      for(let j = 0; j< N; j++) {
          if(i !== j){
          // Calculate power of distance between nodes
          let d = Math.pow(dist(i,j), 2 + mu);
          let node1 = fun(i);
          // Create value for appropriate element of a
          let val = c[node1[0]][node1[1]]/d;
  
          // Assign value to matrix
          a.subset(math.index(i,j), val);

          // Subtract value from diagonal element
          let node2 = fun(j);
          let val1 = a.subset(math.index(i,i)) - c[node2[0]][node2[1]]/d;
          a.subset(math.index(i,i), val1);
          }
      }
  } 

  // Multiply matrix by diffusion coefficient
  m = math.multiply(D, a);
}

function infect(x, state) {
  return state.alpha * x * (1 - x) - state.beta * x;
}

function euler(state) {
  // Create column vector to hold model state during previous period
  let last = math.zeros(N, 1);

  for (let k = 0; k < N; k++){
    let node0 = fun(k);
    u.subset(math.index(k, 0), state.infections[node0[0]][node0[1]]);
  }

  for (let t = 0; t < periods; t++){
    count++;
      for (let k = 0; k < N; k++) {
          let val = u.subset(math.index(k, t));
          last.subset(math.index(k, 0), val);

      }

      // Calculate next iteration
      let v = math.multiply(m, last);

      for (let k = 0; k < N; k++) {
          let val = u.subset(math.index(k, t)) + h * (infect(u.subset(math.index(k, t)), state) + v.subset(math.index(k, 0)));

          u.subset(math.index(k, t + 1), val);

      }
  }

  for (let k = 0; k < N; k++){
    let node0 = fun(k);
    cur[node0[0]][node0[1]] = u.subset(math.index(k, periods - 1));
    console.log(cur);
    
  }



  return cur;
}

function eulerDiffusion(state) {
  // Create column vector to hold model state during previous period
  let last = math.zeros(N, 1);

  for (let k = 0; k < N; k++){
    let node0 = fun(k);
    u.subset(math.index(k, 0), state.infections[node0[0]][node0[1]]);
  }

  for (let t = 0; t < periods; t++){
    count++;
      for (let k = 0; k < N; k++) {
          let val = u.subset(math.index(k, t));
          last.subset(math.index(k, 0), val);

      }

      // Calculate next iteration
      let v = math.multiply(mDiffusion, last);

      for (let k = 0; k < N; k++) {
          let val = u.subset(math.index(k, t)) + h * (infect(u.subset(math.index(k, t)), state) + v.subset(math.index(k, 0)));

          u.subset(math.index(k, t + 1), val);

      }
  }

  for (let k = 0; k < N; k++){
    let node0 = fun(k);
    cur[node0[0]][node0[1]] = u.subset(math.index(k, periods - 1));
    
  }



  return cur;
}

function calculatePercent(state) {
  let sick = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sick += state.infections[i][j] * state.population[i][j];
    }
  }
  return 100*sick/totalPop;
}

function defaultPop(){
  c = [[0.5755951483871738, 0.049671816036299, 0.13992873258806304, 0.08764762633505141, 0.5814739892431717, 0.1780979952155575, 0.29058792293984753, 0.5653063958923548, 0.2996236182681453, 0.025299908300829222, 0.2966463154175256, 0.2812246362642324, 0.08863444873703631, 0.3945360346138399, 0.14711649999329732, 0.12966644124191348, 0.231638995073393, 0.16832621579711932, 0.5414569718132451, 0.9444525515132772],
  [0.6930511302809681, 0.7028044999703095, 0.4066808150821862, 0.1876285084379122, 0.06753383635939111, 0.19619869974545773, 0.2763495452685704, 0.28736991416916985, 0.6744472911226111, 0.1326435412845072, 0.01614603183941543, 0.22317963184492243, 0.1256750823577049, 0.6409222788445349, 0.5334025995115509, 0.5465484082659168, 0.11480685130681309, 0.49171040211784167, 0.09080763405974754, 0.6353578089211926],
  [0.9173551880697326, 0.23356714684797247, 0.6419158869516552, 0.04386833111465405, 0.5447727193371974, 0.11151267406814515, 0.038581294756218985, 0.2676215555011712, 0.03206691268710753, 0.08159593218397172, 0.12504657869015098, 0.043088003733687395, 0.22013635813932456, 0.12809043998761308, 0.4685461890177982, 0.23434489054890906, 0.6605092355364194, 0.2605306362095185, 0.07712472468929743, 0.9329009845156788],
  [0.6447318252370816, 0.004988395871593476, 0.5755880814030823, 0.10533458809527482, 0.043017552800399025, 0.2865950396564422, 0.5325560360556619, 0.25910695081663143, 0.18172849935201948, 0.1810800783811089, 0.0622914690493783, 0.24968967209867357, 0.2164169178357556, 0.12328698660049342, 0.261655793233325, 0.5579796946182699, 0.007169987956742885, 0.5211109567960345, 0.4111123074040716, 0.7881703038359599],
  [0.5007562747182794, 0.18099049830813022, 0.22025714434353721, 0.15075409610533982, 0.10232944669576269, 0.1946508143741154, 0.1980280427473419, 0.5085418472977395, 0.27348528557866963, 0.02009366433405324, 0.09780334630718869, 0.19040473558644172, 0.1388961818567614, 0.0325572971870056, 0.18572964535566042, 0.14244863223372073, 0.5552356462525725, 0.6613947066664703, 0.24581657301820042, 0.8260297486363142],
  [0.7785791061945708, 0.0924234884925728, 0.07521226368936147, 0.17112055798805684, 0.14534418500738103, 0.0787965797660513, 0.08530392024757709, 0.44528905678471137, 0.5626496385877773, 0.05375313080395876, 0.2191037014009253, 0.004768020480657297, 0.11994733808917035, 0.12007882546560075, 0.6804611257234937, 0.5852834455112874, 0.5083510600497632, 0.6895728690780135, 0.29882046657177636, 0.5112170069259548],
  [0.5669431609424768, 0.24334744884105886, 0.08836823086987533, 0.029602898272326605, 0.6278653714773683, 0.21866511785866435, 0.0674646667300648, 0.14414620417529003, 0.03542367381983218, 0.5386046821725919, 0.09520419866594505, 0.6050617776873076, 0.02762118764305728, 0.005093327038947514, 0.5830594576072878, 0.24324527183856925, 0.1731148184922501, 0.6442118177161569, 0.2213181362350142, 0.5980477383668551],
  [0.7940522970599749, 0.11906414211600026, 0.24007465054367175, 0.12835544012984512, 0.36989677675421045, 0.4192110580182411, 0.11538164157465569, 0.46490520045015415, 0.47843838449180015, 0.5650313569971817, 0.2748743717885252, 0.01676938928516698, 0.07149253468314895, 0.4341114849989647, 0.10124240216150661, 0.2844782052815473, 0.5909757205618791, 0.19213234572146556, 0.5960198743223569, 0.5249377896988779],
  [0.5243208906936513, 0.6018483000365772, 0.6973940276327423, 0.5596411883386021, 0.09792020508142814, 0.2293538710010975, 0.07251871194571464, 0.023051520959537972, 0.2608891225761886, 0.23587108126779902, 0.029326584029346292, 0.7628229980319039, 0.06140410209622253, 0.14574206750894558, 0.6389039941857124, 0.6854741627078491, 0.07335437756018819, 0.2306505167497198, 0.013857361041192196, 0.5176922106302477],
  [0.9899701794755245, 0.004361913053200972, 0.6518619722738116, 0.6906705952118504, 0.4210036283939628, 0.02007472573357414, 0.12360416417460118, 0.023035375998951002, 0.01433260751260046, 0.4848815629024874, 0.18996057505728325, 0.6470257903798543, 0.20466215730599027, 0.5615068479456514, 0.23463568621775438, 0.15853396295340283, 0.7065268017782175, 0.12740397478112012, 0.08252148627416844, 0.6798597013097699],
  [0.5517039879941629, 0.44179839603324433, 0.2933509445877195, 0.6042684194781147, 0.2028760615239121, 0.09109990864859838, 0.168204450566013, 0.29625944775565727, 0.022698312567321376, 0.2913039793008594, 0.05687408383188072, 0.019004318257542584, 0.053622137866919585, 0.6046514915125925, 0.03693521360217351, 0.6823407162868894, 0.2491801343938278, 0.21134974151777622, 0.6837123249583095, 0.7334252138775021],
  [0.5078005511180844, 0.16082036874785285, 0.0765058501565299, 0.46543114061750857, 0.03489282467851684, 0.5198716029163198, 0.17276184063278288, 0.27950145775999374, 0.10880237574205949, 0.2151996827685439, 0.20395057434927413, 0.0845290484631056, 0.02731082076975102, 0.44455445286237005, 0.1279727140411491, 0.07550714937283202, 0.6659348975957182, 0.18330125514982867, 0.1739894343355345, 0.9922695341521824],
  [0.5555708062118061, 0.08406486278155283, 0.0121130715242198, 0.5934009680530805, 0.03000066467748681, 0.0486618271964897, 0.05146464486839617, 0.0905209351152387, 0.5575230849880197, 0.04773007736694752, 0.23774294441595079, 0.18649441563984906, 0.232530730849754, 0.006297539709403921, 0.2815771692309447, 0.29008949127038297, 0.004372703108489228, 0.11193789176784594, 0.26398338538111427, 0.5404946825128695],
  [0.8791811913853954, 0.5485160534623995, 0.2539931958885614, 0.2893846717616578, 0.053015818612795605, 0.048793029338665604, 0.0836362396723105, 0.16341075428108578, 0.052552473808185, 0.49652901742610234, 0.07597215792794405, 0.5130065974032995, 0.20234609561590852, 0.15850923235676115, 0.24733626717306145, 0.011762868995449649, 0.22182048479743136, 0.06527000193264944, 0.1555193949905536, 0.6544604203502459],
  [0.5503703078745574, 0.2839389925504668, 0.0786956415365412, 0.18316942110082116, 0.0779283787297201, 0.10617953860454606, 0.16862435432743864, 0.16082479029893593, 0.19022592711492117, 0.21874871412018126, 0.4483399462925812, 0.2515868087650597, 0.6262247635151705, 0.26317854723726836, 0.046899094885024195, 0.11781133720637771, 0.18926449667837966, 0.08804445904854703, 0.5355716990913221, 0.7396641358428181],
  [0.7686658074994364, 0.027000625877078122, 0.1101214510817235, 0.09688838683287657, 0.01176108920391432, 0.1255916685678358, 0.0896695258833243, 0.11996092753470042, 0.5634750834716747, 0.14140735105032168, 0.0794400431202364, 0.008995010483524423, 0.09568588859576112, 0.020662577818601233, 0.12208872898220285, 0.13604427033483454, 0.41167140594015267, 0.2090143298971172, 0.19639853053867465, 0.9414559476086743],
  [0.5300207410242516, 0.6294428971786318, 0.05372108450406676, 0.2398694419752953, 0.030253179972733135, 0.22823460157396536, 0.018988157940850958, 0.16508411117000044, 0.20462563851835294, 0.018056584596161062, 0.5341264305124264, 0.012213945537277615, 0.734494872869723, 0.2582135788676226, 0.05391670682051901, 0.09997757572153607, 0.2291185550328448, 0.6431932109682057, 0.19974548892996238, 0.8459973583467509],
  [0.8031069362846639, 0.04967015357197633, 0.047793272350209935, 0.19787268691533313, 0.21664430889874545, 0.6093977773902889, 0.19627278631492187, 0.023289717030675925, 0.11477865079956184, 0.5145924988939794, 0.005646131085372774, 0.05234256016095233, 0.09818672122765681, 0.49920942120135914, 0.48473335349068813, 0.37889154446672874, 0.48341214756770595, 0.5490905988187104, 0.23885212828255287, 0.7756770008587125],
  [0.8489873080326793, 0.189796593920934, 0.03268685364241173, 0.06535372126777805, 0.2987225928652199, 0.0965633617148609, 0.2509607227719607, 0.02863576624106927, 0.0034511689768313533, 0.5241424381082819, 0.42174519054634696, 0.1298906764291743, 0.0373411959008535, 0.05528399249876657, 0.22800801118139238, 0.6967350781546318, 0.1957866879758246, 0.668062122798861, 0.2803166176284209, 0.6999502124926856],
  [0.7482569947741431, 0.2529971769886013, 0.6977383102630518, 0.066877843087, 0.2390909424802069, 0.29519097947553874, 0.09364111713125345, 0.027786537315214965, 0.23931673173604906, 0.051073927684144094, 0.17440332676586248, 0.2652028115730563, 0.2774735584392421, 0.11914520636338974, 0.036409115397076676, 0.12757036496649277, 0.10073080788660305, 0.10592639975611663, 0.4380443948800962, 0.7881570920854284]];

  createMatrix();

  return c;
}

function randomPop() {
  let rando = new Array(n);
    for (let i = 0; i < n; i++){
      rando[i] = new Array(n).fill(0);
      for (let j = 0; j < n; j++){
        rando[i][j] = Math.random();
      }
    }
    c = rando;
    createMatrix();
    return rando;
}

function randomInitial() {
  let rando = new Array(n);
    for (let i = 0; i < n; i++){
    rando[i] = new Array(N).fill(0);
    }
  let i = Math.floor(Math.random() * n);
  let j = Math.floor(Math.random() * n);
  rando[i][j] = 1;
  
  return rando;
}

function showMode(state) {
  if (state.nonlocal) {
    return 'Current state (simulation now running in nonlocal mode)';
  }
  return 'Current state (simulation now running in classical mode)';
}

function createDiffusionMatrix() {
  for (let i = 0;  i < N; i++) {
      for(let j = 0; j< N; j++) {
          if(i !== j){
          // Check to see if nodes are adjacent
          let d = (dist(i,j) < 2);

          // Create value for appropriate element of aDiffusion
          let val = d;
  
          // Assign value to matrix
          aDiffusion.subset(math.index(i,j), val);

          // Subtract value from diagonal element
          let val1 = aDiffusion.subset(math.index(i,i)) - d;
          aDiffusion.subset(math.index(i,i), val1);
          }
      }
    }
    // Multiply matrix by diffusion coefficient
    mDiffusion = math.multiply(D, aDiffusion);
}

function reducer(state, action) {
  switch (action.type) {
    case "run":
      return { ...state, isRunning: true, message: showMode(state), percentSick: calculatePercent(state) };
    case "rundiffusion":
      return { ...state, nonlocal: false }; 
    case "nonlocal":
      return { ...state, nonlocal: true }; 
    case "stop":
      return { ...state, isRunning: false, message: 'Current state (click the "Run" button above to start the simulation)', percentSick: calculatePercent(state) };
    case "reset":
      return { ...state, isRunning: false, time: 0, infections: initial, message: 'Current state (click the "Run" button above to start the simulation)', percentSick: 100*c[0][0]/totalPop };
    case "iterate":
      return { ...state, time: state.time + 1, infections: euler(state), percentSick: calculatePercent(state)};
    case "increase":
      return {...state, alpha: (state.alpha < 8) * (state.alpha + 0.1) + (state.alpha >= 8) * 8  };
    case "decrease":
      return {...state, alpha: (state.alpha > 0.1) * (state.alpha - 0.1)  };
    case "increasebeta":
      return {...state, beta: (state.beta < 8) * (state.beta + 0.1) + (state.beta >= 8) * 8  };
    case "decreasebeta":
      return {...state, beta: (state.beta > 0.1) * (state.beta - 0.1)  };
    case "randompopulation":
        return {...state, isRunning: false, time: 0, infections: initial, message: 'Current state (click the "Run" button above to start the simulation)', percentSick: 100*c[0][0]/totalPop, population: randomPop(), nonlocal: true };
    case "restorepopulation":
        return {...state, isRunning: false, time: 0, infections: initial, message: 'Current state (click the "Run" button above to start the simulation)', percentSick: 100*c[0][0]/totalPop, population: defaultPop(), nonlocal: true };
    case "randomoutbreak":
        return {...state, isRunning: false, time: 0, infections: randomInitial(), message: 'Current state (click the "Run" button above to start the simulation)', percentSick: 100*c[0][0]/totalPop  };
    case "restoreoutbreak":
        return {...state, isRunning: false, time: 0, infections: initial, message: 'Current state (click the "Run" button above to start the simulation)', percentSick: 100*c[0][0]/totalPop  };
    case "iteratediffusion":
      return { ...state, time: state.time + 1, infections: eulerDiffusion(state), percentSick: calculatePercent(state)};
    case "speedup":
      return {...state, mil: (state.mil > 100) * (state.mil - 100) + (state.mil <= 100) * 100 };
    case "slowdown":
      return { ...state, mil: (state.mil < 1000) * (state.mil + 100) + (state.mil >= 1000) * 1000 };
    default:
      throw new Error();
  }
}

createMatrix();

createDiffusionMatrix();