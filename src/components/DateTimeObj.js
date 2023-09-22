import { parseISO, format } from 'date-fns'
import ja from 'date-fns/locale/ja'

export default function DateTimeObj({ date }) {
	return <time dateTime={date}>{format(parseISO(date), 'yyyy/MM/dd HH:mm', { locale: ja })}</time>;
}