class App {


    constructor() {
        this.canvas = document.querySelector("#myCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.video = document.createElement("video");
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((rawData) => {
                this.video.srcObject = rawData;
                this.video.play();
                this.video.onloadeddata = this.animateTorchEffect
            }).catch(function (err) { alert(err) })
    }

    update = () => {
        const { data } = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);


        let locs = [];
        data.forEach((_, index) => {
            if (index % 4 === 0) {
                let r = data[index];
                let g = data[index + 1];
                let b = data[index + 2];

                if (this.euclidian_space_distance([r, g, b], [7, 207, 232]) < 30) {
                    const x = (index / 4) % this.canvas.width;
                    const y = Math.floor((index / 4) / this.canvas.width);
                    locs.push({ x, y });
                }

            }
        })
        console.log(locs.length)

        // locs.forEach((val, index) => {
        //     this.ctx.fillStyle = "red";
        //     this.ctx.beginPath();
        //     this.ctx.arc(val.x, val.y, 1, 0, Math.PI * 2);
        //     this.ctx.fill();
        // })


        if (locs.length > 0) {
            const center = { x: 0, y: 0 };
            for (let i = 0; i < locs.length; i++) {
                center.x += locs[i].x;
                center.y += locs[i].y;
            }
            center.x /= locs.length;
            center.y /= locs.length;

            let rad = Math.sqrt(this.canvas.width * this.canvas.width +
                this.canvas.height * this.canvas.height);
            rad += Math.random() * 0.1 * rad;

            const grd = this.ctx.createRadialGradient(
                center.x, center.y, rad * 0.05,
                center.x, center.y, rad * 0.2
            )
            grd.addColorStop(0, "rgba(0,0,0,0)");
            grd.addColorStop(1, "rgba(0,0,0,0.8)");

            this.ctx.fillStyle = grd;
            this.ctx.arc(center.x, center.y, rad, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            this.ctx.fillStyle = "rgba(0,0,0,0.8)";
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fill();
        }

    }

    euclidian_space_distance(v1, v2) {

        return Math.sqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) +
            (v1[1] - v2[1]) * (v1[1] - v2[1]) +
            (v1[2] - v2[2]) * (v1[2] - v2[2]));
    }

    animateTorchEffect = () => {

        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;


        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)



        this.update();

        requestAnimationFrame(this.animateTorchEffect);

    }

}



document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
})