// Defines
var ii = new Math.Complex (1, 1);
var Pi = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081L;
var Nmax = 4096;



/*
void MyIntFFT(complex<long_double_t> * f_FFT, const long int * const f, const unsigned int N)
{
    const complex<long_double_t> w0 = exp(ii*(Pi/N));

    long_double_t f_double[Nmax];
    unsigned int i;

    for(i=0; i<N; i++)
    {
        f_double[i] = ( long_double_t ( f[i] ) );
    }

    MyComplexFFT(f_FFT, f_double, N, w0);
}
*/
function MyIntFFT (f_FFT, f, N) {
	
	var w0 = ii.mul(Pi / N);
	w0 = w0.exp();
	
	f_double = new Float64Array (Nmax);
	
    for (i = 0; i < N; i++) {
		f_double[i] = f[i];
	}
	
	MyComplexFFT(f_FFT, f_double, N, w0);
}



/*
void MyComplexFFT(complex<long_double_t> * const f_fft, long_double_t const * const f, const unsigned long N, const complex<long_double_t> w0)
{
    if(N==1)
    {
        f_fft[0] = f[0];
    }
    else
    {
        if(N==2)
        {
            f_fft[0] = f[0] + ii*f[1];
            f_fft[1] = f[0] - ii*f[1];
        }
        else
        {
            assert(N%2==0);
            long_double_t f0[N/2], f1[N/2];
            complex<long_double_t> f0_fft[N/2], f1_fft[N/2], wk, w02;
            unsigned int k;
            for(k=0; k<(N/2); k++)
            {
                f0[k] = f[2*k];
                f1[k] = f[2*k+1];
            }

            w02 = w0*w0;
            wk = w0;
            MyComplexFFT(f0_fft, f0, N/2, w02);
            MyComplexFFT(f1_fft, f1, N/2, w02);
            for(k=0; k<N; k++)
            {
                f_fft[k] = f0_fft[k%(N/2)] + wk*f1_fft[k%(N/2)];
                wk *= w02;
            }
        }
    }
}
*/
function MyComplexFFT (f_fft, f, N, w0)
{
	if (N == 1) {
        f_fft[0] = f[0];
	}
	
    else 
	{
        if (N == 2) {
			iif1 = ii.mul (f[1]);
            f_fft [0] = f[0].add (iif1);
            f_fft [1] = f[0].sub (iif1);
		}
		
		else 
		{
            if (N % 2 != 0) {
				console.log ("ASSERT ERROR MyComplexFFT : N % 2");
				return 0;
			}
			
            // long_double_t f0[N/2], f1[N/2];
            var f0 = new Float64Array (N/2); 
			var f1 = new Float64Array (N/2);
			
			//	complex<long_double_t> f0_fft[N/2], f1_fft[N/2], wk, w02;
			//  unsigned int k;
			var f0_fft = new Array(N/2);
			var f1_fft = new Array(N/2);
			var w02;

            for (k = 0; k < (N/2); k++) {
                f0[k] = f[2*k];
                f1[k] = f[2*k+1];
            }

            w02 = w0.mul(w0);
            wk = w0;
			
            MyComplexFFT(f0_fft, f0, N/2, w02);
            MyComplexFFT(f1_fft, f1, N/2, w02);
			
            for (k = 0; k < N; k++) {
				var firstComplex  = f0_fft[k%(N/2)];
				var secondComplex = f1_fft[k%(N/2)];
                f_fft[k] = firstComplex.add(wk.mul(secondComplex));
                wk = wk.mul(w02);
            }
		}
	}
}