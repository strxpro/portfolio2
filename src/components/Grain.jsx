/** Siatka konstrukcyjna arkusza i znaczniki pasowania w rogach. */
export default function Grain() {
  return (
    <>
      <div className="sheetgrid" aria-hidden="true" />
      <span className="regmark tl" aria-hidden="true" />
      <span className="regmark tr" aria-hidden="true" />
      <span className="regmark bl" aria-hidden="true" />
      <span className="regmark br" aria-hidden="true" />
    </>
  )
}
