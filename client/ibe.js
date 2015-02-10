var Nmax = 4096;

function IBE_Encrypt(C, const m, id0, MPKD, RD)
{
		var i, N, q0;
		var r = new Array(Nmax);
		var e1 = new Array(Nmax);
		var e2 = new Array(Nmax);
		var r_FFT = new Array(Nmax);
		var t_FFT = new Array(Nmax);
		var aux1_FFT = new Array(Nmax);
		var aux2_FFT = new Array(Nmax);
		
		q0 = RD["q0"];
		N = RD["N"];
		
		for(i=0; i<N; i++)
		{
			e1[i] = (Math.random()%3) - 1;
			e2[i] = (Math.random()%3) - 1;
			r[i] = (Math.random()%3) - 1;
		}
		
		MyIntFFT(r_FFT, r, N);
		MyIntFFT(t_FFT, id0, N);
		
		for(i=0; i<N; i++)
		{
			aux1_FFT[i] = r_FFT[i].mul(MPKD["h_FFT"][i]);
			aux2_FFT[i] = r_FFT[i].mul(t_FFT[i]);
		}
		
		MyIntReverseFFT(C[0], aux1_FFT, N);
		MyIntReverseFFT(C[1], aux2_FFT, N);
		
		for(i=0; i<N; i++)
		{
			C[0][i] = (C[0][i] + e1[i] + q0/2)%q0 - (q0/2);
			C[1][i] = (C[1][i] + e2[i] + (q0/2)*m[i] + q0/2)%q0 - (q0/2);
		}
}