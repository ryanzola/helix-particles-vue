uniform sampler2D tDiffuse;
uniform float distort;
uniform float time;

varying vec2 vUv;

const float max_distort=1.;
const int num_iter=12;
const float reci_num_iter_f=1./float(num_iter);

// chromatic abberation
vec2 barrelDistortion(vec2 coord,float amt){
  vec2 cc=coord-.5;
  float dist=dot(cc,cc);
  
  return coord+cc*dist*amt;
}

float sat(float t){
  return clamp(t,0.,1.);
}

float linterp(float t){
  return sat(1.-abs(2.*t-1.));
}

float remap(float t,float a,float b){
  return sat((t-a)/(b-a));
}

vec4 spectrum_offset(float t){
  vec4 ret;
  float lo=step(t,.5);
  float hi=1.-lo;
  float w=linterp(remap(t,1./6.,5./6.));
  ret=vec4(lo,1.,hi,1.)*vec4(1.-w,w,1.-w,1.);
  
  return pow(ret,vec4(1./2.2));
}

void main(){
  vec2 zUV=(vUv-vec2(.5))*.95+vec2(.5);
  vec4 sumcol=vec4(0.);
  vec4 sumw=vec4(0.);
  for(int i=0;i<num_iter;i++){
    float t=float(i)*reci_num_iter_f;
    vec4 w=spectrum_offset(t);
    sumw+=w;
    sumcol+=w*texture2D(tDiffuse,barrelDistortion(zUV,.2*max_distort*t));
  }
  
  vec4 color=sumcol/sumw;
  
  gl_FragColor=color;
}