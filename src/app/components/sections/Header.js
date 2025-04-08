const Header = (ctx, width, height, viewportWidth) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${viewportWidth < 768 ? '40' : '60'}px "Helvetica Neue"`;
  ctx.fillText('Paul Physio', width / 2, height / 4);
  ctx.font = `italic ${viewportWidth < 768 ? '20' : '28'}px "Helvetica Neue"`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('FullStack Web3 Dev', width / 2, height / 4 + (viewportWidth < 768 ? 30 : 50));

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - (viewportWidth < 768 ? 30 : 50), height / 4 + (viewportWidth < 768 ? 50 : 80));
  ctx.lineTo(width / 2 + (viewportWidth < 768 ? 30 : 50), height / 4 + (viewportWidth < 768 ? 50 : 80));
  ctx.stroke();
};

export default Header;