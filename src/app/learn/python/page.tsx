import { FC, ReactNode } from 'react';
import LearnNav from '@/components/learn/LearnNav';
import CodeBlock from '@/components/learn/CodeBlock';

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-neutral-200 dark:bg-neutral-700/70 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-700 dark:text-blue-300 whitespace-nowrap">
      {children}
    </code>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-800 first:pt-0 first:mt-0 first:border-t-0"
    >
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-neutral-700 dark:text-neutral-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-neutral-500 dark:text-neutral-400 border-l-2 border-neutral-300 dark:border-neutral-600 pl-3">
      {children}
    </p>
  );
}

const toc = [
  { id: 'variables', label: 'Variables' },
  { id: 'none', label: 'None' },
  { id: 'conditionals', label: 'Conditionals' },
  { id: 'loops', label: 'Loops' },
  { id: 'division', label: 'Division & modulo' },
  { id: 'math', label: 'Math' },
  { id: 'lists', label: 'Lists' },
  { id: 'strings', label: 'Strings' },
  { id: 'queues', label: 'Queues' },
  { id: 'sets', label: 'Sets' },
  { id: 'dicts', label: 'Dicts' },
  { id: 'tuples', label: 'Tuples' },
  { id: 'heaps', label: 'Heaps' },
  { id: 'functions', label: 'Functions' },
  { id: 'classes', label: 'Classes' },
];

const PythonPage: FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="w-full max-w-4xl mt-16">
        <h1 className="text-5xl font-bold mb-3">Python for LeetCode</h1>
        <p className="text-lg text-neutral-700 dark:text-neutral-300">
          A fast tour of the Python you actually need for DSA — the syntax, the
          built-in structures, and the gotchas that trip people up. Enough of the
          underlying behaviour to reason about it, not just memorise it.
        </p>
      </header>

      <div className="w-full max-w-4xl mt-6">
        <LearnNav />
      </div>

      {/* Jump-to navigation */}
      <nav className="w-full max-w-4xl mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
          Jump to
        </p>
        <div className="flex flex-wrap gap-1.5">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm px-2.5 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="w-full max-w-4xl mt-8">
        <Section id="variables" title="Variables">
          <p>
            No type declarations — assign directly. You can also assign several
            variables in one line:
          </p>
          <CodeBlock
            code={`m, n = "abc", False   # multiple assignment at once
a = 0
a = a + 1              # increment, long form
a += 1                 # increment, shorthand`}
          />
        </Section>

        <Section id="none" title="None (Python's null)">
          <p>
            <InlineCode>None</InlineCode> is the absence of a value — Python&apos;s
            version of <em>null</em>. You can assign it at any point, even after a
            variable held something else:
          </p>
          <CodeBlock
            code={`n = 4
n = None   # now holds nothing`}
          />
        </Section>

        <Section id="conditionals" title="Conditionals">
          <p>
            No curly braces — indentation defines the block. <em>else if</em>{' '}
            becomes <InlineCode>elif</InlineCode>, and the logical operators are
            words: <InlineCode>and</InlineCode>, <InlineCode>or</InlineCode>,{' '}
            <InlineCode>not</InlineCode> (not <InlineCode>{'&&'}</InlineCode> or{' '}
            <InlineCode>{'||'}</InlineCode>). Conditions don&apos;t need
            parentheses, but wrap them in brackets to split across multiple lines.
          </p>
          <CodeBlock
            code={`if n > 5:
    print("big")
elif n == 5:
    print("exactly five")
else:
    print("small")

# brackets let a single condition span multiple lines
if (n > 0
        and n < 100):
    print("in range")`}
          />
        </Section>

        <Section id="loops" title="Loops">
          <p>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              While loops
            </span>{' '}
            run until the condition is false:
          </p>
          <CodeBlock
            code={`n = 0
while n < 5:
    print(n)
    n += 1
# prints 0 1 2 3 4`}
          />
          <p>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              For loops
            </span>{' '}
            iterate over a <InlineCode>range</InlineCode>. Give it a stop, a
            start+stop, or a start+stop+step:
          </p>
          <CodeBlock
            code={`for i in range(5):
    print(i)
# 0 1 2 3 4

for i in range(2, 6):
    print(i)
# 2 3 4 5

for i in range(10, 0, -2):
    print(i)
# 10 8 6 4 2`}
          />
        </Section>

        <Section id="division" title="Division & modulo">
          <p>
            Python does float division by default (most languages default to
            integer division). Use <InlineCode>//</InlineCode> for integer
            division — and note it always{' '}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              rounds down
            </span>{' '}
            (toward negative infinity), unlike most languages that round toward
            zero.
          </p>
          <CodeBlock
            code={`print(5 / 2)     # 2.5   float division by default
print(5 // 2)    # 2     integer division (floors)
print(-3 // 2)   # -2    floors toward -inf, NOT -1
int(-3 / 2)      # -1    converting a float to int truncates toward 0`}
          />
          <p>
            Modulo follows the sign of the{' '}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              divisor
            </span>
            , which surprises people coming from other languages:
          </p>
          <CodeBlock
            code={`print(10 % 3)    # 1
print(-10 % 3)   # 2   (many languages give -1 here)`}
          />
        </Section>

        <Section id="math" title="Math">
          <p>
            The <InlineCode>math</InlineCode> module covers the essentials. And
            because Python integers never overflow, infinities make handy
            sentinels for min/max tracking:
          </p>
          <CodeBlock
            code={`import math

math.floor(3 / 2)   # 1     rounds down
math.ceil(3 / 2)    # 2     rounds up
math.sqrt(4)        # 2.0   square root
math.pow(2, 3)      # 8.0   2 ** 3

float("inf")        # larger than any number  (great for "min so far")
float("-inf")       # smaller than any number (great for "max so far")`}
          />
        </Section>

        <Section id="lists" title="Lists (arrays)">
          <p>
            Lists are dynamic, so they double as stacks. <InlineCode>append</InlineCode>{' '}
            and <InlineCode>pop</InlineCode> work on the end in O(1); inserting in
            the middle is O(n) because every later element shifts across.
          </p>
          <CodeBlock
            code={`arr = [1, 2, 3]
arr.append(4)     # push to end
arr.pop()         # pop from end -> 4
arr.insert(1, 7)  # insert 7 at index 1  (O(n): shifts everything right)

arr[0]            # index      (O(1))
arr[0] = 2        # reassign   (O(1))`}
          />
          <p>Initialise a fixed-size list, and index from the end with negatives:</p>
          <CodeBlock
            code={`arr = [1] * n          # n copies of 1

arr = [1, 2, 3]
print(arr[-1], arr[-2])   # 3 2   (last, second-last)

print(100 in arr)         # membership search -> O(n)`}
          />
          <p>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Slicing
            </span>{' '}
            grabs a sub-list. The end index is exclusive (just like{' '}
            <InlineCode>range</InlineCode>):
          </p>
          <CodeBlock
            code={`arr = [1, 2, 3, 4]
print(arr[1:3])   # [2, 3]   index 1 up to (not including) 3
print(arr[0:4])   # [1, 2, 3, 4]`}
          />
          <p>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Unpacking
            </span>{' '}
            assigns each element to its own variable — great for iterating pairs:
          </p>
          <CodeBlock code={`a, b, c = [1, 2, 3]`} />
          <p>Three common ways to loop:</p>
          <CodeBlock
            code={`nums = [1, 2, 3]

for i in range(len(nums)):   # by index
    print(nums[i])

for n in nums:               # by value
    print(n)

for i, n in enumerate(nums): # index and value together
    print(i, n)`}
          />
          <p>
            To walk multiple lists at once, <InlineCode>zip</InlineCode> pairs them
            up and you unpack each pair:
          </p>
          <CodeBlock
            code={`nums1 = [1, 3, 5]
nums2 = [2, 4, 6]

for n1, n2 in zip(nums1, nums2):
    print(n1, n2)
# 1 2
# 3 4
# 5 6`}
          />
          <p>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Sorting
            </span>{' '}
            is in place. Ascending by default; pass a <InlineCode>key</InlineCode>{' '}
            for custom ordering (works on strings too — alphabetical by default):
          </p>
          <CodeBlock
            code={`arr.reverse()                  # reverse in place
arr.sort()                     # ascending
arr.sort(reverse=True)         # descending
arr.sort(key=lambda x: len(x)) # custom: by length`}
          />
          <p>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              List comprehensions
            </span>{' '}
            build lists inline:
          </p>
          <CodeBlock
            code={`[i for i in range(5)]       # [0, 1, 2, 3, 4]
[i + i for i in range(5)]   # [0, 2, 4, 6, 8]

# 2D grid: a 4x4 of zeros
grid = [[0] * 4 for _ in range(4)]`}
          />
          <Note>
            Don&apos;t write <InlineCode>{'[[0] * 4] * 4'}</InlineCode> — that makes
            four references to the <em>same</em> row, so editing one edits all of
            them.
          </Note>
        </Section>

        <Section id="strings" title="Strings">
          <p>They behave a lot like lists, including slicing:</p>
          <CodeBlock
            code={`s = "abc"
print(s[0:2])   # "ab"`}
          />
          <p>
            Strings are{' '}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              immutable
            </span>{' '}
            — you can&apos;t change a character in place. You can build a new string
            with <InlineCode>+=</InlineCode>, but that allocates a fresh string, so
            it counts as O(n).
          </p>
          <CodeBlock
            code={`int("123") + int("123")   # 246        string -> int
str(123) + str(123)       # "123123"   int -> string
ord("A")                  # 65         char -> ASCII value

strings = ["ab", "cd", "ef"]
"".join(strings)          # "abcdef"   (use " " to space them out)`}
          />
        </Section>

        <Section id="queues" title="Queues (deque)">
          <p>
            <InlineCode>deque</InlineCode> is a double-ended queue: add or remove
            from either end in O(1). (A list is O(n) to pop from the front, so use
            this for BFS.)
          </p>
          <CodeBlock
            code={`from collections import deque

queue = deque()
queue.append(1)       # add on the right
queue.append(2)
queue.popleft()       # pop from the left -> 1  (O(1))
queue.appendleft(0)   # add on the left
queue.pop()           # pop from the right`}
          />
        </Section>

        <Section id="sets" title="Hash sets">
          <p>
            O(1) insert and search, with no duplicates. Reach for a set whenever
            you&apos;re asking &quot;have I seen this before?&quot;.
          </p>
          <CodeBlock
            code={`mySet = set()
mySet.add(1)
mySet.add(2)
len(mySet)          # 2
print(1 in mySet)   # True   (O(1) search)
mySet.remove(2)

set([1, 2, 3])            # build from a list
{ i for i in range(5) }  # set comprehension -> {0, 1, 2, 3, 4}`}
          />
        </Section>

        <Section id="dicts" title="Hash maps (dict)">
          <p>
            Key-value store with O(1) operations and unique keys. The workhorse of
            most LeetCode solutions.
          </p>
          <CodeBlock
            code={`myMap = {}
myMap["alice"] = 88
myMap["bob"] = 77
myMap["alice"] = 80          # overwrite an existing key

print("alice" in myMap)      # True
myMap.pop("alice")           # remove a key

myMap = {"alice": 90, "bob": 77}   # dict literal
{ i: 2 * i for i in range(3) }     # comprehension -> {0: 0, 1: 2, 2: 4}`}
          />
          <Note>
            The comprehension form is a common way to build an adjacency list for
            graph problems.
          </Note>
          <p>Three ways to iterate:</p>
          <CodeBlock
            code={`myMap = {"alice": 90, "bob": 70}

for key in myMap:              # keys (the default)
    print(key, myMap[key])

for value in myMap.values():   # values only
    print(value)

for key, val in myMap.items(): # key and value together
    print(key, val)`}
          />
        </Section>

        <Section id="tuples" title="Tuples">
          <p>
            Like lists but immutable — you can index, not modify. Written with{' '}
            <InlineCode>()</InlineCode> instead of <InlineCode>[]</InlineCode>.
          </p>
          <CodeBlock
            code={`tup = (1, 2, 3)
print(tup[0])   # 1
# tup[0] = 0    # error: tuples can't be modified`}
          />
          <p>
            Their main use in DSA: because they&apos;re hashable, tuples can be keys
            in a set or dict — lists cannot.
          </p>
          <CodeBlock
            code={`myMap = { (1, 2): 3 }     # a pair of values as the key

mySet = set()
mySet.add((1, 2))
print((1, 2) in mySet)    # True

# myMap[[3, 4]] = 5       # error: lists aren't hashable`}
          />
        </Section>

        <Section id="heaps" title="Heaps">
          <p>
            Use a heap when you repeatedly need the current min (or max). Under the
            hood it&apos;s an array; Python&apos;s <InlineCode>heapq</InlineCode>{' '}
            gives you a min-heap.
          </p>
          <CodeBlock
            code={`import heapq

minHeap = []
heapq.heappush(minHeap, 3)
heapq.heappush(minHeap, 2)
heapq.heappush(minHeap, 5)
print(minHeap[0])   # 2  -> the min is always at index 0

while len(minHeap):
    print(heapq.heappop(minHeap))   # prints smallest -> largest`}
          />
          <p>
            There&apos;s no max-heap, so push the negatives and negate again on the
            way out:
          </p>
          <CodeBlock
            code={`maxHeap = []
heapq.heappush(maxHeap, -3)
heapq.heappush(maxHeap, -2)
heapq.heappush(maxHeap, -4)

while len(maxHeap):
    print(-1 * heapq.heappop(maxHeap))   # prints largest -> smallest`}
          />
          <Note>
            Already have the values? <InlineCode>heapq.heapify(arr)</InlineCode>{' '}
            turns a list into a heap in O(n), in place.
          </Note>
        </Section>

        <Section id="functions" title="Functions">
          <p>
            Define with <InlineCode>def</InlineCode>, name it, list the parameters,
            and indent the body:
          </p>
          <CodeBlock
            code={`def someFunction(a, b):
    return a * b

print(someFunction(3, 4))   # 12`}
          />
          <p>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Nested functions
            </span>{' '}
            are great for recursion (especially graph DFS): the inner function can
            read all of the outer function&apos;s variables, so you don&apos;t have
            to thread state through parameters.
          </p>
          <CodeBlock
            code={`def outer(a, b):
    c = "c"

    def inner():
        return a + b + c   # sees outer's variables

    return inner()

print(outer("a", "b"))   # "abc"`}
          />
          <p>
            You can <em>mutate</em> an outer object from an inner function, but{' '}
            <em>reassigning</em> an outer variable needs the{' '}
            <InlineCode>nonlocal</InlineCode> keyword:
          </p>
          <CodeBlock
            code={`def outer():
    count = 0

    def inner():
        nonlocal count
        count += 1     # reassigns outer's variable

    inner()
    return count       # 1`}
          />
        </Section>

        <Section id="classes" title="Classes">
          <p>
            More limited than in many languages. A class has a constructor
            (<InlineCode>__init__</InlineCode>) and methods. Every method takes{' '}
            <InlineCode>self</InlineCode> first — Python&apos;s{' '}
            <InlineCode>this</InlineCode> — which is how you reach member variables
            and other methods.
          </p>
          <CodeBlock
            code={`class MyClass:

    # constructor
    def __init__(self, nums):
        self.nums = nums      # create member variables with self.
        self.size = len(nums)

    # self is always the first parameter
    def getLength(self):
        return self.size

    def getDoubleLength(self):
        return 2 * self.getLength()   # call another method via self`}
          />
        </Section>
      </div>

      <footer className="mt-20 mb-5">
        <p className="text-sm text-neutral-500 text-center">
          Made with ✨, powered by ☕
          <br />
          by Manav Dodia
        </p>
      </footer>
    </main>
  );
};

export default PythonPage;
