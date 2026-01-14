<style>
    #reader {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        aspect-ratio: 1 / 1;
        background-color: #000;
        position: relative;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .group-button {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .text-instruction {
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .text-coming-soon {
        font-size: 2rem;
        line-height: 1.125rem;
        color: #000000;
        margin-bottom: 0.5rem;
        text-align: center;
        font-weight: 600;
        margin: 20px;
    }

    .btn-scan {
        position: relative;
        display: inline-grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 600;
        border-radius: 0.5rem;
        outline: none;
        transition-property: all;
        transition-duration: 75ms;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        background-color: var(--primary-600, #d97706);
        /* Fallback to amber/primary color */
        color: white;
        cursor: pointer;
        border: none;
    }

    .btn-scan:hover {
        opacity: 0.9;
    }

    .btn-scan:focus-visible {
        ring: 2px solid var(--primary-500, #d97706);
    }
</style>
{{-- <div x-data="{
    scanner: null,
    initScanner() {
        if (document.getElementById('reader')) {
            if (typeof Html5Qrcode === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/html5-qrcode';
                script.onload = () => this.startScanner();
                document.head.appendChild(script);
            } else {
                this.startScanner();
            }
        } else {
            setTimeout(() => this.initScanner(), 100);
        }
    },
    async startScanner() {
        try {
            if (this.scanner) {
                await this.scanner.stop().catch(err => console.log('Stop failed', err));
            }
            this.scanner = new Html5Qrcode('reader');

            // Responsive qrbox calculation
            const qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
                const minEdgePercentage = 0.70;
                const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
                return {
                    width: qrboxSize,
                    height: qrboxSize
                };
            };

            const config = {
                fps: 15,
                qrbox: qrboxFunction,
                aspectRatio: 1.0,
                experimentalFeatures: {
                    useBarCodeDetectorIfSupported: true
                }
            };

            await this.scanner.start({ facingMode: 'environment' },
                config,
                (decodedText, decodedResult) => {
                    console.log('Scanned:', decodedText);
                    document.getElementById('reader').style.border = '5px solid #22c55e'; // Visual feedback

                    this.scanner.stop().then(() => {
                        try {
                            $wire.handleQrScan(decodedText).then(() => {
                                console.log('Backend call successful');
                                $dispatch('close-modal', { id: 'scan-qr-modal' });
                            }).catch(error => {
                                console.error('Backend call failed', error);
                                alert('Gagal memproses QR Code: ' + error);
                                document.getElementById('reader').style.border = 'none';
                            });
                        } catch (e) {
                            console.error('JS Error calling wire', e);
                            alert('Terjadi kesalahan sistem: ' + e);
                        }
                    });
                },
                (errorMessage) => {
                    // console.warn(errorMessage);
                }
            );
        } catch (err) {
            console.error('Error starting scanner', err);
            if (err?.name === 'NotAllowedError' || err?.toString().includes('Permission')) {
                alert('Izin kamera diperlukan untuk memindai QR Code. Silakan izinkan akses kamera di browser Anda.');
            } else {
                alert('Gagal mengakses kamera: ' + err);
            }
        }
    }
}" x-init="initScanner()"
    @close-modal.window="if(scanner) scanner.stop().catch(e=>console.log(e))"> --}}
<p class="text-coming-soon">Coming Soon.</p>
{{-- <div id="reader"></div>
    <div class="group-button">
        <p class="text-instruction">Arahkan kamera ke QR Code.</p>
        <button type="button" x-on:click="startScanner()" class="btn-scan">
            Mulai Scan / Izin Kamera
        </button>
    </div> --}}

{{-- <script src="https://unpkg.com/html5-qrcode" type="text/javascript"></script> --}}
{{-- </div> --}}
