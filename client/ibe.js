var Nmax = 4096;

function IBE_Encrypt(C, m, id0, MPKD, RD)
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

function IBE_Decrypt(w0, C, SKid_FFT, RD)
{
	var i, N, q0;
	var c0_FFT[Nmax]  = new Array(Nmax);
	var aux_FFT[Nmax]  = new Array(Nmax);
	
	q0 = RD["q0"];
	N = RD["N"];
	
	MyIntFFT(c0_FFT, C[0], N);
	
	for(i=0; i<N; i++)
	{
		aux_FFT[i] = c0_FFT[i].mul(SKid_FFT[i]);
	}
	
	MyIntReverseFFT(w0, aux_FFT, N);
	
	for(i=0; i<N; i++)
	{
		w0[i] = C[1][i] - w0[i];
		w0[i] = (w0[i])%q0;
		w0[i] = (w0[i] + (q0>>2) )/(q0>>1);
		w0[i] %= 2;
	}
}